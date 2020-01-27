package com.eir.gdr.tests

import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.logic.CharacterLogic
import com.eir.gdr.logic.applyPerksModifiers
import com.eir.gdr.logic.applyRaceModifiers
import com.eir.gdr.tests.base.TestHelpers
import com.eir.gdr.awaitResult
import io.vertx.core.json.Json
import org.junit.Test
import org.junit.jupiter.api.assertDoesNotThrow
import kotlin.test.assertNotNull

class CharacterTest {
    @Test
    fun getCharacterTest() {
        assert(true)
//        val character =
//            CharacterLogic.getCharacterComplete { CharacterLogic.getById(1) } (TestHelpers.getDatabaseClient())
//                .awaitResult()
//
//        assertNotNull(character)
//        assertNotNull(character)
//        assert(character.martialAbilities?.isNotEmpty() == true)
    }

    @Test
    fun raceModifiersTest() {
        val character = CharacterLogic.getCharacterComplete {
            CharacterLogic.getById(1)
        }(TestHelpers.getDatabaseClient()).awaitResult()

        assertNotNull(character)

        assertDoesNotThrow {
            character.applyRaceModifiers()(TestHelpers.getDatabaseClient()).awaitResult()
        }
    }

    @Test
    fun perksModifiersTest() {
        val character = CharacterLogic.getCharacterComplete {
            CharacterLogic.getById(1)
        }(TestHelpers.getDatabaseClient()).awaitResult()

        assertNotNull(character)

        assertDoesNotThrow {
            character.applyPerksModifiers()(TestHelpers.getDatabaseClient()).awaitResult()
        }
    }

    @Test
    fun creationTest() {
        val serializedCharacter = "{\"id\":null,\"name\":\"Eichmann\",\"type\":{\"id\":2,\"name\":\"Marziale (moderato)\"},\"fatherRace\":{\"id\":2,\"name\":\"Dwerg\"},\"motherRace\":{\"id\":3,\"name\":\"Noérn\"},\"hasModifiers\":true,\"martialAttributes\":[{\"id\":1,\"name\":\"Forza\",\"value\":3},{\"id\":2,\"name\":\"Destrezza\",\"value\":3},{\"id\":3,\"name\":\"Resistenza\",\"value\":3},{\"id\":4,\"name\":\"Percezione\",\"value\":3}],\"mentalAttributes\":[{\"id\":5,\"name\":\"Carisma\",\"value\":3},{\"id\":6,\"name\":\"Intelligenza\",\"value\":2},{\"id\":7,\"name\":\"Volontà\",\"value\":3},{\"id\":8,\"name\":\"Empatia\",\"value\":2}],\"martialAbilities\":[{\"id\":9,\"name\":\"Abilità Marziale\",\"value\":1},{\"id\":10,\"name\":\"Armi a distanza\",\"value\":1},{\"id\":11,\"name\":\"Armi a due mani\",\"value\":2},{\"id\":12,\"name\":\"Armi a una mano\",\"value\":1},{\"id\":13,\"name\":\"Atletica\",\"value\":1},{\"id\":14,\"name\":\"Autocontrollo\",\"value\":1},{\"id\":15,\"name\":\"Balistica\",\"value\":1}],\"mentalAbilities\":[{\"id\":24,\"name\":\"Alchimia\",\"value\":1},{\"id\":25,\"name\":\"Botanica\",\"value\":1},{\"id\":26,\"name\":\"Conoscenze\",\"value\":2},{\"id\":27,\"name\":\"Cucinare\",\"value\":2},{\"id\":31,\"name\":\"Intimidire\",\"value\":1},{\"id\":32,\"name\":\"Intrattenere\",\"value\":2},{\"id\":33,\"name\":\"Legge\",\"value\":1}],\"perks\":[{\"id\":1,\"name\":\"Aquila\",\"affectedCharacteristic\":[]}]}"
        val character = Json.decodeValue(serializedCharacter, UserCharacter::class.java)
        assertNotNull(character.name)
        assertDoesNotThrow {
            CharacterLogic.save(character, 1)(TestHelpers.getDatabaseClient()).awaitResult()
        }
    }
}
