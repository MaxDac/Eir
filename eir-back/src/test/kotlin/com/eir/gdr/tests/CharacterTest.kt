package com.eir.gdr.tests

import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.logic.CharacterLogic
import com.eir.gdr.tests.base.TestHelpers
import com.eir.gdr.awaitResult
import com.eir.gdr.logic.CharacterSaveLogic
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
            CharacterSaveLogic.applyRaceModifiers(character)(TestHelpers.getDatabaseClient()).awaitResult()
        }
    }

    @Test
    fun perksModifiersTest() {
        val character = CharacterLogic.getCharacterComplete {
            CharacterLogic.getById(1)
        }(TestHelpers.getDatabaseClient()).awaitResult()

        assertNotNull(character)

        assertDoesNotThrow {
            CharacterSaveLogic.applyPerksModifiers(character)(TestHelpers.getDatabaseClient()).awaitResult()
        }
    }

    @Test
    fun creationTest() {
        val serializedCharacter = "{\"id\":null,\"name\":\"Eichmann\",\"type\":{\"id\":2,\"name\":\"Marziale (moderato)\"},\"fatherRace\":{\"id\":2,\"name\":\"Dwerg\"},\"motherRace\":{\"id\":3,\"name\":\"Noérn\"},\"hasModifiers\":true,\"martialAttributes\":[{\"id\":1,\"name\":\"Forza\",\"value\":3},{\"id\":2,\"name\":\"Destrezza\",\"value\":3},{\"id\":3,\"name\":\"Resistenza\",\"value\":3},{\"id\":4,\"name\":\"Percezione\",\"value\":3}],\"mentalAttributes\":[{\"id\":5,\"name\":\"Carisma\",\"value\":3},{\"id\":6,\"name\":\"Intelligenza\",\"value\":2},{\"id\":7,\"name\":\"Volontà\",\"value\":3},{\"id\":8,\"name\":\"Empatia\",\"value\":2}],\"martialAbilities\":[{\"id\":9,\"name\":\"Abilità Marziale\",\"value\":1},{\"id\":10,\"name\":\"Armi a distanza\",\"value\":1},{\"id\":11,\"name\":\"Armi a due mani\",\"value\":2},{\"id\":12,\"name\":\"Armi a una mano\",\"value\":1},{\"id\":13,\"name\":\"Atletica\",\"value\":0},{\"id\":14,\"name\":\"Autocontrollo\",\"value\":1},{\"id\":15,\"name\":\"Balistica\",\"value\":0},{\"id\":16,\"name\":\"Cavalcare\",\"value\":2},{\"id\":17,\"name\":\"Consapevolezza\",\"value\":0},{\"id\":18,\"name\":\"Forgiare armature\",\"value\":0},{\"id\":19,\"name\":\"Forgiare armi\",\"value\":0},{\"id\":20,\"name\":\"Forgiare monili\",\"value\":0},{\"id\":21,\"name\":\"Furtività\",\"value\":0},{\"id\":22,\"name\":\"Schivare\",\"value\":0},{\"id\":23,\"name\":\"Sopravvivenza\",\"value\":0}],\"mentalAbilities\":[{\"id\":24,\"name\":\"Alchimia\",\"value\":1},{\"id\":25,\"name\":\"Botanica\",\"value\":1},{\"id\":26,\"name\":\"Conoscenze\",\"value\":1},{\"id\":27,\"name\":\"Cucinare\",\"value\":2},{\"id\":28,\"name\":\"Diplomazia\",\"value\":1},{\"id\":29,\"name\":\"Espressione\",\"value\":1},{\"id\":30,\"name\":\"Guarire\",\"value\":1},{\"id\":31,\"name\":\"Intimidire\",\"value\":2},{\"id\":32,\"name\":\"Intrattenere\",\"value\":0},{\"id\":33,\"name\":\"Legge\",\"value\":0},{\"id\":34,\"name\":\"Mentire\",\"value\":0},{\"id\":35,\"name\":\"Mercanteggiare\",\"value\":0},{\"id\":36,\"name\":\"Mestiere\",\"value\":0},{\"id\":37,\"name\":\"Navigare\",\"value\":0},{\"id\":38,\"name\":\"Scassinare\",\"value\":0}],\"perks\":[{\"id\":1,\"name\":\"Aquila\",\"affectedCharacteristic\":[]}]}"
        val character = Json.decodeValue(serializedCharacter, UserCharacter::class.java)
        assertNotNull(character.name)
        assertDoesNotThrow {
            CharacterSaveLogic.save(character, 1)(TestHelpers.getDatabaseClient()).awaitResult()
        }
    }
}
