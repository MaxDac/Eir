package com.eir.gdr.routes

import com.eir.gdr.db.catchToResponse
import com.eir.gdr.logic.ChatLogic
import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router

object ChatInfoRoutes : CustomRoutes {
    override fun defineRoutes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        router.get("/Rooms").handler { ctx ->
            ChatLogic.getRooms()(client)
                .catchToResponse(ctx)
        }

        router.get("/Room/:id/Entries").handler { ctx ->
            val id = ctx.request().params().get("id")
            ChatLogic.getChatEntriesByRoomId(id.toInt())(client)
                .catchToResponse(ctx)
        }

        return router
    }
}
