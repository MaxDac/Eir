package com.eir.gdr.tests

import com.eir.gdr.db.Database
import com.eir.gdr.entities.login.AuthenticationRequest
import com.eir.gdr.logic.AuthenticationLogic
import com.eir.gdr.tests.base.TestHelpers
import com.eir.gdr.tests.base.awaitResult
import io.vertx.core.Vertx
import org.junit.Test

class LoginTests {
    @Test
    fun okLoginTest() {
        val request = AuthenticationRequest("ciccillo", "bitonto")

        val result = AuthenticationLogic.checkLogin(request, TestHelpers.getDatabaseClient()).awaitResult()
        assert(result == true)
    }
}
