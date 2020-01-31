package com.eir.gdr.logic

import com.eir.gdr.*
import com.eir.gdr.db.dmlAsync
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.entities.character.UserCharacter
import io.vertx.core.Future

object ExperienceLogic {
    fun addCharacteristic(characterId: Int, characteristicId: Int): ClientFuture<Unit> = { client ->
        fun checkExperience(character: UserCharacter, chr: Characteristic): Pair<Boolean, Int> {
            val multiplier =
                if (chr.nature == Constants.NATURE_ATTRIBUTE) 5
                else 3

            val category =
                when (Pair(chr.nature, chr.type)) {
                    Pair(Constants.NATURE_ATTRIBUTE, Constants.MARTIAL_CHARACTERISTIC) ->
                        character.martialAttributes
                    Pair(Constants.NATURE_ATTRIBUTE, Constants.MENTAL_CHARACTERISTIC) ->
                        character.mentalAttributes
                    Pair(Constants.NATURE_ABILITY, Constants.MARTIAL_CHARACTERISTIC) ->
                        character.martialAbilities
                    else ->
                        character.mentalAbilities
                }

            val currentValue = category?.firstOrNull { x -> x.id == chr.id }?.value ?: 0
            val amount = (if (currentValue == 0) 1 else currentValue) * multiplier
            return Pair(
                (character.experience ?: 0) - (character.experienceSpent ?: 0) >= amount,
                amount
            )
        }

        fun addExperience (character: UserCharacter, chr: Characteristic, amount: Int): ClientFuture<Unit> = { client ->
            val updateClient =
                client.dmlAsync("UPDATE Character SET experience_spent = experience_spent + $amount " +
                        "WHERE id = ${character.id}")
            val updateCharacteristic =
                client.dmlAsync("UPDATE CharacterRelCharacteristic SET value = value + 1 " +
                        "WHERE character_id = ${character.id} AND characteristic_id = ${chr.id}")

            updateClient.bind { updateCharacteristic }
        }

        CharacteristicLogic.getCharacteristicById(characteristicId)(client)
            .bind { chr -> CharacterLogic.getCharacterComplete { CharacterLogic.getById(characterId) }(client)
                .map { cchr -> Pair(cchr, chr) } }
            .bind { (character, chr) ->
                if (character != null && chr != null) {
                    val (checkResult, amount) = checkExperience(character, chr)

                    if (checkResult) addExperience(character, chr, amount)(client)
                    else Future.failedFuture<Unit>(ApiException.insufficientExperience)
                }
                else {
                    Future.failedFuture<Unit>(ApiException.insufficientExperience)
                }
            }
    }
}
