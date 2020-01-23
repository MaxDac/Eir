package com.eir.gdr.routes

import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext

object CorsRoutes : CustomRoutes {
    fun addCorsHeaders(context: RoutingContext): RoutingContext {
        context.response().putHeader("Access-Control-Allow-Headers", listOf("Content-Type", "x-session-header"))
        context.response().putHeader("Access-Control-Allow-Origin", "http://localhost:4200")
        context.response().putHeader("Access-Control-Allow-Methods", listOf("GET", "POST"))
        context.response().putHeader("Access-Control-Allow-Credentials", "true")
        return context
    }

    override fun defineRoutes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        // Adding cors headers
//        router.get().handler { ctx ->
//            addCorsHeaders(ctx)
//            ctx.next()
//        }

        // Adding cors headers
        router.route().handler { ctx ->
            addCorsHeaders(ctx)
            ctx.next()
        }

        // Adding cors headers
        router.options().handler { ctx ->
            addCorsHeaders(ctx)
            ctx.response().statusCode = 200
            ctx.response().end()
        }

        return router
    }
}
