package com.eir.gdr.logic

import com.eir.gdr.*
import com.eir.gdr.db.Queries
import com.eir.gdr.db.dmlAsync
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.entities.Effect
import com.eir.gdr.entities.Race
import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.entities.character.UserCharacteristic
import com.eir.gdr.entities.character.UserPerk
import com.eir.gdr.logic.Exceptions.notFound
import io.vertx.core.Future
import io.vertx.core.Promise
import io.vertx.core.logging.LoggerFactory
import kotlin.math.abs

object CharacterLogic {
    private val logger = LoggerFactory.getLogger(CharacterLogic::class.java)

    fun getCharacterByQuery(query: String): ClientFuture<List<UserCharacter>?> = { client ->
        client.queryAsync(query)
            .map { x -> UserCharacter.readCharacterMinimal(x) }
    }

    fun getByName(name: String): ClientFuture<UserCharacter?> = { client ->
        getCharacterByQuery(Queries.getCharacterByName(name))(client)
            .map { us -> us?.firstOrNull() }
    }

    fun getById(id: Int): ClientFuture<UserCharacter?> = { client ->
        getCharacterByQuery(Queries.getCharacterById(id))(client)
            .map { us -> us?.firstOrNull() }
    }

    fun getByUserId(userId: Int): ClientFuture<List<UserCharacter>?> =
        getCharacterByQuery(Queries.getCharacterByUserId(userId))

    fun getByRoomId(roomId: Int): ClientFuture<List<UserCharacter>?> =
        getCharacterByQuery(Queries.getCharacterByRoomId(roomId))

    fun getCharacterComplete(delegate: () -> ClientFuture<UserCharacter?>): ClientFuture<UserCharacter?> = { client ->
        fun getAttributesByCharId(charId: Int): Future<List<Characteristic>> =
            client.queryAsync(Queries.getCharacterAttributes(charId))
                .map { rs -> Characteristic.readUserCharacteristics(rs) }

        fun getAbilitiesByCharId(charId: Int): Future<List<Characteristic>> =
            client.queryAsync(Queries.getCharacterAbilities(charId))
                .map { rs -> Characteristic.readUserCharacteristics(rs) }

        fun getPerksByCharId(charId: Int): Future<List<UserPerk>> =
            client.queryAsync(Queries.getPerksByCharacter(charId))
                .map { rs -> UserPerk.getCharacterPerk(rs) }

        delegate()(client)
            .bind { c ->
                if (c?.id == null) throw notFound

                getAttributesByCharId(c.id!!).map { cc ->
                c.martialAttributes = cc
                    .filter { x -> x.type == "Marziale" }
                    .map { x -> UserCharacteristic(x.id, x.name, x.value) }

                c.mentalAttributes = cc
                    .filter { x -> x.type == "Mentale" }
                    .map { x -> UserCharacteristic(x.id, x.name, x.value) }

                c
            } }
            .bind { c -> getAbilitiesByCharId(c!!.id!!).map { cc ->
                c.martialAbilities = cc
                    .filter { x -> x.type == "Marziale" }
                    .map { x -> UserCharacteristic(x.id, x.name, x.value) }

                c.mentalAbilities = cc
                    .filter { x -> x.type == "Mentale" }
                    .map { x -> UserCharacteristic(x.id, x.name, x.value) }

                c
            } }
            .bind { c -> getPerksByCharId(c!!.id!!).map { cc ->
                c.perks = cc
                c
            } }
    }

    fun save(parsedCharacter: UserCharacter?, userId: Int?): ClientFuture<Unit> = { client ->
        if (parsedCharacter == null || userId == null) throw notFound

        val insertionDml =
            "insert into Character(name, type, user_id, father_race_id, mother_race_id, has_modifiers) " +
                "values ('${parsedCharacter.name}', ${parsedCharacter.type!!.id}, $userId, " +
                    "${parsedCharacter.fatherRace!!.id}, ${parsedCharacter.motherRace!!.id}, " +
                    "${if (parsedCharacter.hasModifiers == true) 1 else 0})"

        val characterDml =
            client.dmlAsync(insertionDml)

        fun characteristicsDml(character: UserCharacter): Future<Any> {
            val promise = Promise.promise<Any>()
            return CharacteristicLogic.getAbilities()(client).flatMap { abilities ->
                val c = parsedCharacter.addEmptyAbilities(abilities)
                client.getConnection { connection ->
                    if (connection.succeeded()) {
                        val attr =
                            c.martialAttributes!! + c.mentalAttributes!! + c.martialAbilities!! + c.mentalAbilities!!

                        fun processInfosAsync(attrs: List<UserCharacteristic>) {
                            if (attrs.isEmpty()) {
                                promise.complete()
                                return
                            }
                            val cc = attrs.head()!!

                            val dml =
                                "insert into CharacterRelCharacteristic(character_id, characteristic_id, value, original_value) " +
                                        "values (${character.id}, ${cc.id}, ${cc.value}, ${cc.value});\n"
                            connection.result().execute(dml) { res ->
                                if (res.succeeded()) {
                                    processInfosAsync(attrs.tail())
                                } else {
                                    promise.fail(res.cause())
                                }
                            }
                        }

                        processInfosAsync(attr)
                    } else {
                        promise.fail(connection.cause())
                    }
                }

                promise.future()
            }
        }

        fun perksDml(c: UserCharacter): ClientFuture<Unit> = { client ->
            val promise = Promise.promise<Unit>()

            client.getConnection { conn ->
                if (conn.succeeded()) {
                    fun insertPerks(ps: List<UserPerk>) {
                        if (ps.isEmpty()) {
                            promise.complete()
                            return
                        }

                        conn.result().execute("insert into CharacterRelPerk(character_id, perk_id) " +
                                "values (${c.id}, ${ps.head()!!.id});\n") { res ->
                            if (res.succeeded()) insertPerks(ps.tail())
                            else promise.fail(res.cause())
                        }
                    }

                    insertPerks(c.perks!!)
                }
                else {
                    promise.fail(conn.cause())
                }
            }

            promise.future()
        }

        val promise = Promise.promise<Unit>()

        characterDml
            .bind { getByName(parsedCharacter.name!!)(client) }
            .bind { user -> characteristicsDml(user!!).map { user } }
            .setHandler { res ->
                if (res.succeeded()) {
                    perksDml(res.result()!!)(client)
                        .bind { getCharacterComplete { getByName(parsedCharacter.name!!) }(client) }
                        .bind { c -> c!!.applyRaceModifiers()(client).map { c } }
                        .bind { c -> c!!.applyPerksModifiers()(client) }
                        .map { promise.complete() }
                }
            }

        promise.future()
    }

    fun update(character: UserCharacter): ClientFuture<Unit> = { client ->
        val dml = Queries.updateCharacterInfos(character)
        client.dmlAsync(dml)
    }
}

fun List<Characteristic>.discriminateAndSortCharacteristics(type: String): List<Characteristic> =
    this.filter { x -> x.type == type }
        .sortedBy { x -> x.id }


tailrec fun checkById(
    ls1: List<UserCharacteristic>,
    ls2: List<Characteristic>,
    acc: List<UserCharacteristic> = listOf()
): List<UserCharacteristic> =
    when {
        ls2.isEmpty() -> acc
        ls1.head()?.id == ls2.head()?.id -> checkById(ls1.tail(), ls2.tail(), acc + ls1.head()!!)
        else -> {
            val emptyCharacteristic = ls2.head()?.let { c -> UserCharacteristic(
                c.id,
                c.name,
                0
            )}
            checkById(ls1, ls2.tail(), acc + emptyCharacteristic!!)
        }
    }

fun UserCharacter.addEmptyAbilities(abilities: List<Characteristic>): UserCharacter {
    val martials = abilities.discriminateAndSortCharacteristics("Marziale")
    val mentals = abilities.discriminateAndSortCharacteristics("Mentale")
    val newMartials = checkById(this.martialAbilities!!, martials)
    val newMentals = checkById(this.mentalAbilities!!, mentals)

    return this.copy(
        martialAbilities = newMartials,
        mentalAbilities = newMentals
    )
}

fun UserCharacter.applyRaceModifiers(): ClientFuture<Unit> = { client ->
    fun applyRaceTraits(c: UserCharacter, r: Race): ClientFuture<Unit> = { cl ->
        val firstOperation = cl.dmlAsync("UPDATE CharacterRelCharacteristic SET value = value - 1 " +
                "WHERE character_id = ${c.id} AND characteristic_id = ${r.minAttribute.id}")
        val secondOperation = cl.dmlAsync("UPDATE CharacterRelCharacteristic SET value = value + 1 " +
                "WHERE character_id = ${c.id} AND characteristic_id = ${r.maxAttribute.id}")

        firstOperation.bind { secondOperation }
    }

    if (this.hasModifiers == true) {
        val future = RaceLogic.getRaceById(this.fatherRace!!.id!!)(client)
            .bind { race -> applyRaceTraits(this, race)(client) }

        if (this.fatherRace?.id != this.motherRace?.id) {
            future.bind {
                RaceLogic.getRaceById(this.motherRace!!.id!!)(client)
            }.bind { motherRace -> applyRaceTraits(this, motherRace)(client) }
        } else {
            future
        }
    } else {
        Future.succeededFuture()
    }
}

fun UserCharacter.applyPerksModifiers(): ClientFuture<Unit> = { client ->
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

    this.perks!!.map { p ->
            PerksLogic.getPerksWithEffectsById(p.id!!)
                .bind { pp -> applyPerkTraits(this, pp.affectedCharacteristic!!).flattenClientFuture() }
        }.flattenClientFuture()
        .map { lsss -> lsss.flatten().reduce { _, _ -> run {} } }(client)
}
