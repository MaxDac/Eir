package com.eir.gdr

import com.eir.gdr.db.catchToResponse
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.entities.Characteristic.Companion.readCharacteristics
import io.vertx.core.Future
import io.vertx.core.Vertx
import io.vertx.core.json.Json
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext

object Routes {
    private fun addCorsHeaders(context: RoutingContext): RoutingContext {
        context.response().putHeader("Access-Control-Allow-Headers", "Content-Type")
        context.response().putHeader("Access-Control-Allow-Origin", "http://localhost:4200")
        return context
    }

    fun routes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        // Adding cors headers
        router.options().handler { ctx ->
            addCorsHeaders(ctx)
            ctx.response().statusCode = 200
            ctx.response().end()
        }

        // Adding cors headers
        router.get().handler { ctx ->
            addCorsHeaders(ctx)
            ctx.next()
        }

        router.get("/Abilities").handler { ctx ->
            client.queryAsync("SELECT * FROM Abilities")
                .map { rs -> readCharacteristics(rs) }
                .catchToResponse(ctx)
        }

        router.get("/Characteristics").handler { ctx ->
            client.queryAsync("SELECT * FROM Characteristics")
                .map { rs -> readCharacteristics(rs) }
                .catchToResponse(ctx)
        }

        router.mountSubRouter("/", StaticRouter.routes(vertx))

//        router.route().handler(staticHandler())

        return router
    }
}
