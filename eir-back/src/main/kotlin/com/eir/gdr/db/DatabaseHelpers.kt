package com.eir.gdr.db

import io.vertx.core.AsyncResult
import io.vertx.core.Future
import io.vertx.core.Handler
import io.vertx.core.Promise
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.sql.ResultSet
import io.vertx.ext.sql.SQLConnection

fun <T> manageAsyncResultDefault(p: Promise<T>): Handler<AsyncResult<T>> =
    Handler { res ->
        if (res.succeeded()) {
            p.complete(res.result())
        }
        else {
            p.fail(res.cause())
        }
    }

fun <T> asFuture(handler: (Handler<AsyncResult<T>>) -> Any) =
    Future.future<T> { p ->
        handler(manageAsyncResultDefault(p))
    }

fun JDBCClient.getConnectionAsync(): Future<SQLConnection> =
    asFuture<SQLConnection> { h -> this.getConnection(h) }

fun SQLConnection.queryAsync(sql: String): Future<ResultSet> =
    asFuture<ResultSet> { h ->
        val result = this.query(sql, h)
        result
    }

fun JDBCClient.queryAsync(sql: String): Future<ResultSet> =
    this.getConnectionAsync()
        .flatMap { c -> c.queryAsync(sql).map { res -> Pair(c, res) } }
        .map { res ->
            res.first.close()
            res.second
        }

fun SQLConnection.dmlAsync(sql: String): Future<Void> =
    asFuture<Void> { h ->
        val result = this.execute(sql, h)
        result
    }

fun JDBCClient.dmlAsync(sql: String): Future<Unit> =
    this.getConnectionAsync()
        .flatMap { c -> c.dmlAsync(sql).map { c } }
        .map { c -> c.close() }
