package com.eir.gdr

import com.eir.gdr.db.queryAsync
import com.eir.gdr.logic.AuthenticationLogic
import com.eir.gdr.logic.Exceptions
import com.eir.gdr.routes.GuardRoutes
import io.vertx.core.Future
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.RoutingContext
import java.security.MessageDigest
import java.util.*

typealias ClientFuture<T> = (JDBCClient) -> Future<T>

fun <T> List<List<T>>.flatten(): List<T> {
    tailrec fun f(source: List<List<T>>, acc: List<T> = listOf()): List<T> {
        if (source.isEmpty()) return acc

        return f(source.drop(1), source.first() + acc)
    }

    return f(this)
}

fun <T, Q> Future<T>.bind(f: (T) -> Future<Q>): Future<Q> =
    Future.future { p ->
        this.setHandler { res ->
            if (res.succeeded()) {
                try {
                    f(res.result()).setHandler { res2 ->
                        if (res2.succeeded()) p.complete(res2.result())
                        else p.fail(res2.cause())
                    }
                }
                catch (ex: Exception) {
                    p.fail(ex)
                }
            }
            else {
                p.fail(res.cause())
            }
        }
    }

fun String.toMD5(): String {
    val bytes = MessageDigest.getInstance("MD5").digest(this.toByteArray())
    return Base64.getEncoder().encodeToString(bytes)
}

fun RoutingContext.getUserFromSession(client: JDBCClient): Future<Int?> {
    return try {
        val cookieToken = this.request().getCookie(GuardRoutes.cookieTokenName)
        val sessionToken = this.request().getHeader(GuardRoutes.headerTokenName)

        if (cookieToken.value.isNullOrEmpty() || sessionToken.isNullOrEmpty()) throw Exceptions.sessionInvalid

        AuthenticationLogic.checkSessionTokens(sessionToken, cookieToken.value, client)
    }
    catch (ex: java.lang.Exception) {
        println("Error while validating the routes: $ex")
        Future.failedFuture(ex)
    }
}
