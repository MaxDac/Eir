package com.eir.gdr.tests

import com.eir.gdr.entities.chat.ChatEntryRequest
import com.eir.gdr.tests.base.TestHelpers
import com.eir.gdr.awaitResult
import org.junit.Test
import org.junit.jupiter.api.assertDoesNotThrow
import kotlin.test.assertNotNull

class ChatTests {
    @Test
    fun diceTest() {
        val request = ChatEntryRequest(
            roomId = 1,
            characterId = 3,
            action = "",
            attributeId = 4,
            abilityId = 17,
            cd = 20
        )
        assertDoesNotThrow {
            val result = request.mountPhrase()(TestHelpers.getDatabaseClient()).awaitResult()
            assertNotNull(result)
        }
    }
}
