package com.eir.gdr.db

import io.vertx.core.Future
import io.vertx.core.json.Json
import io.vertx.ext.web.RoutingContext

fun <T> RoutingContext.parseBody(clazz: Class<T>): T? =
    Json.decodeValue(
        this.bodyAsString,
        clazz
    )

fun <T> RoutingContext.mapToResponse(item: T) {
    this.response().putHeader("Content-Type", "application/json")
    this.response().end(Json.encode(item))
}

fun <T> Future<T>.catchToResponse(ctx: RoutingContext): Future<T> =
    this.setHandler { res ->
        ctx.mapToResponse(
            if (res.succeeded()) res.result() else res.cause()
        )
    }
