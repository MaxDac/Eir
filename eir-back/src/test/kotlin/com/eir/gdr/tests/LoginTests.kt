package com.eir.gdr.tests

import com.eir.gdr.entities.login.AuthenticationRequest
import com.eir.gdr.logic.AuthenticationLogic
import com.eir.gdr.tests.base.TestHelpers
import com.eir.gdr.awaitResult
import org.junit.Test
import kotlin.test.assertNotNull

class LoginTests {
    @Test
    fun okLoginTest() {
        val request = AuthenticationRequest("ciccillo", "bitonto")

        val result = AuthenticationLogic.checkLogin(request, TestHelpers.getDatabaseClient()).awaitResult()
        assertNotNull(result)
    }
}
