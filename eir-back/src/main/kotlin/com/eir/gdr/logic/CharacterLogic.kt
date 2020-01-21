package com.eir.gdr.logic

import com.eir.gdr.bind
import com.eir.gdr.db.Queries
import com.eir.gdr.db.dmlAsync
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.entities.Perk
import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.entities.character.UserCharacteristic
import com.eir.gdr.entities.character.UserPerk
import com.eir.gdr.logic.Exceptions.notFound
import io.vertx.core.Future
import io.vertx.ext.jdbc.JDBCClient

object CharacterLogic {
    fun getByName(name: String): (JDBCClient) -> Future<UserCharacter?> = { client ->
        client.queryAsync(Queries.getCharacterByName(name))
            .map { x -> UserCharacter.readCharacterMinimal(x).firstOrNull() }
    }

    fun getByNameComplete(name: String): (JDBCClient) -> Future<UserCharacter?> = { client ->
        fun getAttributesByCharId(charId: Int): Future<List<Characteristic>> =
            client.queryAsync(Queries.getCharacterAttributes(charId))
                .map { rs -> Characteristic.readUserCharacteristics(rs) }

        fun getAbilitiesByCharId(charId: Int): Future<List<Characteristic>> =
            client.queryAsync(Queries.getCharacterAbilities(charId))
                .map { rs -> Characteristic.readUserCharacteristics(rs) }

        fun getPerksByCharId(charId: Int): Future<List<UserPerk>> =
            client.queryAsync(Queries.getPerksByCharacter(charId))
                .map { rs -> UserPerk.getCharacterPerk(rs) }

        getByName(name)(client)
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

    fun save(c: UserCharacter): (JDBCClient) -> Future<Unit> = { client ->
        val characterDml =
            client.dmlAsync("insert into Character(name, type, race) values ('${c.name}', ${c.type!!.id}, ${c.race!!.id})")

        fun characteristicsDml(charId: Int): Future<Unit> =
            (c.martialAttributes!! + c.mentalAttributes!! + c.mentalAbilities!! + c.mentalAbilities!!).map { cc ->
                client.dmlAsync("insert into CharacterRelCharacteristic(character_id, characteristic_id, value) " +
                        "values ($charId, ${cc.id}, ${cc.value});\n")
            }.reduce { p, n ->
                p.flatMap { n }
            }

        fun perksDml(charId: Int): Future<Unit> =
            c.perks?.map { pp ->
                client.dmlAsync("insert into CharacterRelPerk(character_id, perk_id) " +
                        "values ($charId, ${pp.id});\n")
            }?.reduce { p, n ->
                p.flatMap { n }
            } ?: Future.future {}

        characterDml
            .flatMap { getByName(c.name!!)(client) }
            .flatMap { user -> characteristicsDml(user!!.id!!).map { user.id } }
            .flatMap { id -> perksDml(id!!) }
    }
}
