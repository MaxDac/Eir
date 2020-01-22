package com.eir.gdr

import com.eir.gdr.routes.*
import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.BodyHandler

object Routes {
    private val WHITELISTED_ROUTES: List<CustomRoutes> = listOf(
        HelpRoutes,
        AuthenticationRoutes
    )

    private val CHECKED_ROUTES: List<CustomRoutes> = listOf(
        CharacterRoutes
    )

    fun routes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        router.route().handler(BodyHandler.create())

        CorsRoutes.defineRoutes(router, client)

        WHITELISTED_ROUTES.forEach { r ->
            r.defineRoutes(router, client)
        }

        GuardRoutes.defineRoutes(router, client)

        CHECKED_ROUTES.forEach { r ->
            r.defineRoutes(router, client)
        }

        router.mountSubRouter("/", StaticRouter.routes(vertx))

//        router.route().handler(staticHandler())

        return router
    }
}
