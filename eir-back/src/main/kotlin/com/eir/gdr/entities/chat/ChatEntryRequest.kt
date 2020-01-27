package com.eir.gdr.entities.chat

import com.eir.gdr.ClientFuture
import com.eir.gdr.logic.CharacterLogic
import kotlin.random.Random

data class ChatEntryRequest(
    var roomId: Int? = null,
    var characterId: Int? = null,
    var action: String? = null,
    var attributeId: Int? = null,
    var abilityId: Int? = null,
    var cd: Int? = null
) {
    val isActionSimple = !action.isNullOrBlank()

    val isDiceThrow =
        attributeId != null &&
                abilityId != null &&
                cd != null

    fun throwDice(): ClientFuture<Pair<Int, Int>> = { client ->
        CharacterLogic.getCharacterComplete { CharacterLogic.getById(characterId!!) } (client)
            .map { c->
                c?.let { cc ->
                    val attributeValue =
                        (cc.martialAttributes!! + cc.mentalAttributes!!).first { x -> x.id == attributeId }
                    val abilityValue =
                        (cc.martialAbilities!! + cc.mentalAbilities!!)
                            .firstOrNull() { x -> x.id == abilityId }

                    Pair(attributeValue.value!! + (abilityValue?.value ?: 0), Random.nextInt(1, 20))
                }
            }
    }

    fun mountPhrase(): ClientFuture<String> = { client ->
        throwDice()(client)
            .map { (attributeSum, rand) -> "Il tiro ha totalizzato ${attributeSum + rand} (dado: $rand) su una CD di $cd." }
    }
}
