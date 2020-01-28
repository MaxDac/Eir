package com.eir.gdr.logic

import com.eir.gdr.*
import com.eir.gdr.db.dmlAsync
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.entities.Effect
import com.eir.gdr.entities.Perk
import com.eir.gdr.entities.Race
import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.entities.character.UserCharacteristic
import com.eir.gdr.entities.character.UserPerk
import io.vertx.core.Future
import io.vertx.core.Promise
import io.vertx.ext.sql.SQLConnection
import kotlin.math.abs

object CharacterSaveLogic {
    fun userInsertDml(c: UserCharacter, userId: Int) =
        "insert into Character(name, type, user_id, father_race_id, mother_race_id, has_modifiers) " +
                "values ('${c.name}', ${c.type!!.id}, $userId, " +
                "${c.fatherRace!!.id}, ${c.motherRace!!.id}, " +
                "${if (c.hasModifiers == true) 1 else 0})"

    fun insertCharacteristicsDml(c: UserCharacter, cc: UserCharacteristic) =
        "insert into CharacterRelCharacteristic(character_id, characteristic_id, value, original_value) " +
                "values (${c.id}, ${cc.id}, ${cc.value}, ${cc.value});\n"

    fun insertPerksDml(c: UserCharacter, p: UserPerk) =
        "insert into CharacterRelPerk(character_id, perk_id) " +
                "values (${c.id}, ${p.id});\n"

    fun insertUserCharacter(c: UserCharacter, userId: Int): ClientFuture<UserCharacter?> = { client ->
        val dml = userInsertDml(c, userId)
        client.dmlAsync(dml)
            .bind { CharacterLogic.getByName(c.name!!)(client) }
            .map { cc -> c.copy(id = c.id) }
    }

    fun insertCharacteristics(c: UserCharacter): ClientFuture<UserCharacter> = { client ->
        val promise = Promise.promise<UserCharacter>()

        fun insertCharacteristicsInternal(connection: SQLConnection, cs: List<UserCharacteristic>): Future<Unit>? {
            val innerPromise = Promise.promise<Unit>()

            if (cs.isEmpty()) {
                innerPromise.complete()
            }
            else {
                cs.head()?.let { characteristic ->
                    val dml = insertCharacteristicsDml(c, characteristic)
                    connection.execute(dml) { res ->
                        if (res.succeeded()) insertCharacteristicsInternal(connection, cs.tail())
                        else promise.fail(res.cause())
                    }
                }
            }

            return innerPromise.future()
        }

        val userCharacteristics =
            c.martialAttributes!! +
                    c.mentalAttributes!! +
                    c.martialAbilities!! +
                    c.mentalAbilities!!

        client.getConnection { conn ->
            if (conn.failed()) promise.fail(conn.cause())
            else {
                insertCharacteristicsInternal(conn.result(), userCharacteristics)
                conn.result().close { res ->
                    if (res.succeeded()) promise.complete(c)
                    else promise.fail(res.cause())
                }
            }
        }

        promise.future()
    }

    fun insertPerks(c: UserCharacter): ClientFuture<UserCharacter> = { client ->
        val promise = Promise.promise<UserCharacter>()

        fun insertPerksInternal(connection: SQLConnection, cs: List<UserPerk>) {
            if (cs.isEmpty()) {
                promise.complete()
                return
            }

            cs.head()?.let { perk ->
                val dml = insertPerksDml(c, perk)
                connection.execute(dml) { res ->
                    if (res.succeeded()) insertPerksInternal(connection, cs.tail())
                    else promise.fail(res.cause())
                }
            }
        }

        client.getConnection { conn ->
            if (conn.failed()) promise.fail(conn.cause())
            else {
                insertPerksInternal(conn.result(), c.perks!!)
                conn.result().close { res ->
                    if (res.succeeded()) promise.complete()
                    else promise.fail(res.cause())
                }
            }
        }

        promise.future()
    }

    fun applyRaceModifiers(c: UserCharacter): ClientFuture<Unit> = { client ->
        fun applyRaceTraits(c: UserCharacter, r: Race): ClientFuture<Unit> = { cl ->
            val firstOperation = cl.dmlAsync("UPDATE CharacterRelCharacteristic SET value = value - 1 " +
                    "WHERE character_id = ${c.id} AND characteristic_id = ${r.minAttribute.id}")
            val secondOperation = cl.dmlAsync("UPDATE CharacterRelCharacteristic SET value = value + 1 " +
                    "WHERE character_id = ${c.id} AND characteristic_id = ${r.maxAttribute.id}")

            firstOperation.bind { secondOperation }
        }

        if (c.hasModifiers == true) {
            val future = RaceLogic.getRaceById(c.fatherRace!!.id!!)(client)
                .bind { race -> applyRaceTraits(c, race)(client) }

            if (c.fatherRace?.id != c.motherRace?.id) {
                future.bind {
                    RaceLogic.getRaceById(c.motherRace!!.id!!)(client)
                }.bind { motherRace -> applyRaceTraits(c, motherRace)(client) }
            } else {
                future
            }
        } else {
            Future.succeededFuture()
        }
    }

    fun applyPerksModifiers(c: UserCharacter): ClientFuture<Unit> = { client ->
        tailrec fun applyPerkTraits(
            c: UserCharacter, es: List<Effect>, acc: List<ClientFuture<Unit>> = listOf()): List<ClientFuture<Unit>> =
            if (!es.isNullOrEmpty()) {
                val operation: ClientFuture<Unit> = { cl ->
                    val e = es.head()!!
                    val addend = if (e.value < 0) " - ${abs(e.value)}" else " + ${e.value}"
                    cl.dmlAsync("UPDATE CharacterRelCharacteristic SET value = value$addend " +
                            "WHERE character_id = ${c.id} AND characteristic_id = ${e.characteristic.id}")
                }

                applyPerkTraits(c, es.tail(), acc + operation)
            } else {
                acc
            }

        c.perks!!.map { p ->
            PerksLogic.getPerksWithEffectsById(p.id!!)
                .bind { pp -> applyPerkTraits(c, pp.affectedCharacteristic!!).flattenClientFuture() }
        }.flattenClientFuture()
            .map { lsss -> lsss.flatten().reduce { _, _ -> run {} } }(client)
    }

    fun save(character: UserCharacter, userId: Int): ClientFuture<Unit> {
        insertUserCharacter(character, userId)
            .bind { c -> insertCharacteristics(c) }
    }
}
