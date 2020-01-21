package com.eir.gdr.tests

import com.eir.gdr.bind
import io.vertx.core.Future
import org.junit.Test
import java.io.InvalidObjectException
import kotlin.test.assertEquals

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
}
