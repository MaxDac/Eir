package com.eir.gdr

import io.vertx.core.Vertx

fun main(args: Array<String>) {
    val vertx = Vertx.vertx()
    vertx.deployVerticle(WebServerVerticle())
}
