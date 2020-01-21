package com.eir.gdr

import com.eir.gdr.routes.CharacterRoutes
import com.eir.gdr.routes.CustomRoute
import com.eir.gdr.routes.HelpRoutes
import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.BodyHandler

object Routes {
    private val routes: List<CustomRoute> = listOf(
        HelpRoutes,
        CharacterRoutes
    )

    private fun addCorsHeaders(context: RoutingContext): RoutingContext {
        context.response().putHeader("Access-Control-Allow-Headers", "Content-Type")
        context.response().putHeader("Access-Control-Allow-Origin", "http://localhost:4200")
        return context
    }

    fun routes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        router.route().handler(BodyHandler.create())

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

        // Adding cors headers
        router.post().handler { ctx ->
            addCorsHeaders(ctx)
            ctx.next()
        }

        routes.forEach { r ->
            r.defineRoutes(router, client)
        }

        router.mountSubRouter("/", StaticRouter.routes(vertx))

//        router.route().handler(staticHandler())

        return router
    }
}
