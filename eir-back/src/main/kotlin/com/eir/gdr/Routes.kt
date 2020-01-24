package com.eir.gdr

import com.eir.gdr.logic.ChatLogic
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
        ChatInfoRoutes,
        CharacterRoutes,
        ForumRoutes
    )

    fun routes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        router.route().handler(BodyHandler.create())

        router.mountSubRouter("/", CorsRoutes.defineRoutes(vertx, client))

        WHITELISTED_ROUTES.forEach { r ->
            router.mountSubRouter("/Api", r.defineRoutes(vertx, client))
        }

        router.mountSubRouter("/", StaticRouter.routes(vertx))

        ChatLogic.getRooms()(client)
            .map { rooms ->
                rooms.forEach { r ->
                    router.mountSubRouter("/Api/Chat/${r.id}", ChatRoutes(r.id).defineRoutes(vertx, client))
                }
            }

        router.mountSubRouter("/", GuardRoutes.defineRoutes(vertx, client))

        CHECKED_ROUTES.forEach { r ->
            router.mountSubRouter("/Api", r.defineRoutes(vertx, client))
        }

//        router.route().handler(staticHandler())

        return router
    }
}
