package com.eir.gdr

import com.eir.gdr.db.Database
import io.vertx.core.AbstractVerticle

class WebServerVerticle : AbstractVerticle() {
    private val port = 8080

    override fun start() {
        val server = vertx.createHttpServer()
            .requestHandler(Routes.routes(vertx, Database.client(vertx)))
            .exceptionHandler { ex ->
                println("Error! $ex")
            }
            .listen(port) { res ->
                if (res.succeeded()) {
                    println("Web server listening on port $port")
                }
                else {
                    println("Ops! ${res.cause()}")
                }
            }
    }
}

