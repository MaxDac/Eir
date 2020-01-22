package com.eir.gdr.routes

import com.eir.gdr.bind
import com.eir.gdr.db.mapToResponse
import com.eir.gdr.db.parseBody
import com.eir.gdr.entities.login.AuthenticationRequest
import com.eir.gdr.logic.AuthenticationLogic
import com.eir.gdr.logic.Exceptions
import io.vertx.core.http.Cookie
import io.vertx.core.json.Json
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router

object AuthenticationRoutes : CustomRoutes {
    override fun defineRoutes(router: Router, client: JDBCClient) {
        router.post("/Login").handler { ctx ->
            val request = ctx.parseBody(AuthenticationRequest::class.java)
            if (request?.isValid() == false) ctx.mapToResponse("No body!")

            AuthenticationLogic.checkLogin(request!!, client)
                .bind { x ->
                    if (x == null) throw Exceptions.userNotFound
                    else {
                        AuthenticationLogic.generateSessionTokens(x, client)
                            .map { ts -> Pair(x, ts) }
                    }
                }
                .map { (userId, ts) ->
                    ctx.response().addCookie(Cookie.cookie(GuardRoutes.cookieTokenName, ts.cookieToken))
                    ctx.response().putHeader(GuardRoutes.headerTokenName, ts.headerToken)
                    ctx.response().end(Json.encode(ts.copy(userId = userId)))
                }
        }
    }
}
