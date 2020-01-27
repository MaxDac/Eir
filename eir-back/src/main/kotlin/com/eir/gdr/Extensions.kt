package com.eir.gdr

import com.eir.gdr.logic.AuthenticationLogic
import com.eir.gdr.logic.Exceptions
import com.eir.gdr.routes.GuardRoutes
import io.vertx.core.Future
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.RoutingContext
import java.security.MessageDigest
import java.util.*
import kotlin.collections.HashMap

typealias ClientFuture<T> = (JDBCClient) -> Future<T>

fun <T> List<List<T>>.flatten(): List<T> {
    tailrec fun f(source: List<List<T>>, acc: List<T> = listOf()): List<T> {
        if (source.isEmpty()) return acc

        return f(source.drop(1), source.first() + acc)
    }

    return f(this)
}

fun <T> List<T>.head(): T? =
    if (this.isEmpty()) null
    else this[0]

fun <T> List<T>.tail(): List<T> =
    if (this.isEmpty()) listOf<T>()
    else this.drop(1)

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

fun HashMap<String, Any>.tryGet(key: String): Any? =
    if (this.containsKey(key)) this.get(key) else null

fun HashMap<String, Any>.tryGetString(key: String): String? =
    this.tryGet(key)?.toString()

fun HashMap<String, Any>.tryGetInt(key: String): Int? =
    try {
        this.tryGet(key)?.toString()?.toInt()
    }
    catch (ex: Exception) {
         null
    }

fun <T> List<Future<T>>.flattenFuture(): Future<List<T>> {
    tailrec fun flattenInternal(ls: List<Future<T>>, acc: Future<List<T>>): Future<List<T>> =
        if (ls.isEmpty()) acc
        else flattenInternal(ls.tail(), acc.bind { lss -> ls.head()!!.map { f -> lss + f } })

    return if (this.isEmpty()) Future.succeededFuture()
    else flattenInternal(this.tail(), this.head()!!.map { el -> listOf(el) })
}

fun <T, Q> ClientFuture<T>.map(f: (T) -> Q): ClientFuture<Q> = { client ->
    this(client).map { r -> f(r) }
}

fun <T, Q> ClientFuture<T>.bind(f: (T) -> ClientFuture<Q>): ClientFuture<Q> = { client ->
    this(client).bind { r -> f(r)(client) }
}

fun <T> List<ClientFuture<T>>.flattenClientFuture(): ClientFuture<List<T>> {
    tailrec fun flattenInternal(ls: List<ClientFuture<T>>, acc: ClientFuture<List<T>>): ClientFuture<List<T>> =
        if (ls.isEmpty()) acc
        else flattenInternal(ls.tail(), acc.bind { lss -> ls.head()!!.map { el -> lss + el } })

    return if (this.isEmpty()) { _ -> Future.succeededFuture() }
    else flattenInternal(this.tail(), this.head()!!.map { el -> listOf(el) })
}
