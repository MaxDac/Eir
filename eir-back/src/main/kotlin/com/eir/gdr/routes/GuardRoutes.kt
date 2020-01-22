package com.eir.gdr.routes

import com.eir.gdr.db.mapToResponse
import com.eir.gdr.getUserFromSession
import io.vertx.core.Future
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext

object GuardRoutes : CustomRoutes {
    val cookieTokenName = "x-session-cookie"
    val headerTokenName = "x-session-header"
    val sessionExpiredInMs = 1000 * 60 * 60

    private fun checkSessionContext(ctx: RoutingContext, client: JDBCClient): Future<Boolean> =
        ctx.getUserFromSession(client)
            .map { x -> x != null }

    override fun defineRoutes(router: Router, client: JDBCClient) {
        router.get().handler { ctx ->
            checkSessionContext(ctx, client)
                .setHandler { res ->
                    if (res.succeeded() && res.result()) ctx.next()
                    else ctx.mapToResponse("Session not found")
                }
        }
    }
}
