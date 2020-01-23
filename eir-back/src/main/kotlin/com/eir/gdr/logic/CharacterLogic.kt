package com.eir.gdr.logic

import com.eir.gdr.ClientFuture
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

    fun save(c: UserCharacter?, userId: Int?): ClientFuture<Unit> = { client ->
        if (c == null || userId == null) throw notFound

        val insertionDml = "insert into Character(name, type, race, user_id) " +
                "values ('${c.name}', ${c.type!!.id}, ${c.race!!.id}, $userId)"

        val characterDml =
            client.dmlAsync(insertionDml)

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
            .bind { getByName(c.name!!)(client) }
            .bind { user -> characteristicsDml(user!!.id!!).map { user.id } }
            .bind { id -> perksDml(id!!) }
    }
}
