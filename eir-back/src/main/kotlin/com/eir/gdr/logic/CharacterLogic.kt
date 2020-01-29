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

    fun update(character: UserCharacter): ClientFuture<Unit> = { client ->
        val dml = Queries.updateCharacterInfos(character)
        client.dmlAsync(dml)
    }
}
