package com.eir.gdr.tests

import com.eir.gdr.bind
import com.eir.gdr.tests.base.async
import com.eir.gdr.tests.base.awaitResult
import com.eir.gdr.toMD5
import io.vertx.core.Future
import io.vertx.core.Handler
import io.vertx.core.Promise
import io.vertx.core.Vertx
import org.junit.Test
import java.io.InvalidObjectException
import java.util.*
import java.util.concurrent.Executors
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class ExtensionTests {

    fun firstFuture() = Future.future<String> { p ->
        println("failing")
        p.fail(IllegalArgumentException())
    }

    fun secondFuture() = Future.future<String> { p ->
        println("succeeding")
        p.complete("Success!")
    }

    @Test
    fun futureBindTestFirstFailed() {
        val result = firstFuture().bind { r ->
            secondFuture().map { rr -> r + rr }
        }

        result.setHandler { res ->
            if (res.succeeded()) assert(false) { "Should have failed" }
            assert(true)
        }
    }

    @Test
    fun futureBindTestSecondFailed() {
        val result = secondFuture().bind { r ->
            firstFuture()
                .map { rr -> r + rr }
        }

        result.setHandler { res ->
            if (res.succeeded()) assert(false) { "Should have failed" }
            assert(true)
        }
    }

    @Test
    fun futureBindTestBothSucceeding() {
        val result = secondFuture().bind { r ->
            secondFuture()
                .map { rr -> r + rr }
        }

        result.setHandler { res ->
            if (res.succeeded()) assert(res.result() == "Success!Success!")
            else assert(false) { "Should have succeeded"}
        }
    }

    @Test
    fun md5Test() {
        val password = "pirla"
        val encryptedPassword = password.toMD5()
        val secondEncryptedPassword = password.toMD5()
        assertNotNull(encryptedPassword)
        assertNotNull(secondEncryptedPassword)
        assertEquals(encryptedPassword, secondEncryptedPassword)
    }

    @Test
    fun awaitFutureResult() {
        val tp = Executors.newCachedThreadPool()
        val step1 = Calendar.getInstance().timeInMillis
//        val future = Future.future<String> { p ->
//            tp.execute {
//                Thread.sleep(1000)
//                p.complete("Ok")
//            }
//        }
        val future = async<String> { p ->
            Thread.sleep(1000)
            p.complete("Ok")
        }

        val step2 = Calendar.getInstance().timeInMillis

        val result = future.awaitResult()
        val step3 = Calendar.getInstance().timeInMillis

        val firstStep = step2 - step1
        val secondStep = step3 - step2

        assertNotNull(result)
        assert(result == "Ok")
        tp.shutdown()
    }
}
