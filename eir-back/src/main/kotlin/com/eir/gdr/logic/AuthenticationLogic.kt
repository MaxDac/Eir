package com.eir.gdr.logic

import com.eir.gdr.db.dmlAsync
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.login.AuthenticationRequest
import com.eir.gdr.entities.login.SessionTokens
import io.vertx.core.Future
import io.vertx.core.Promise
import io.vertx.ext.jdbc.JDBCClient
import java.util.*

object AuthenticationLogic {
    fun checkLogin(request: AuthenticationRequest, client: JDBCClient): Future<Int?> =
        client.queryAsync(
            "SELECT id FROM Users WHERE username = '${request.username}' " +
                    "and password = '${request.encryptedPassword}'"
        )
            .map { rs -> rs.rows.map { x -> x.getInteger("id") }.firstOrNull() }

    fun generateSessionTokens(userId: Int, client: JDBCClient): Future<SessionTokens> {
        val promise = Promise.promise<SessionTokens>()
        val sessionTokens = SessionTokens.generateNewTokens()

        client.dmlAsync("INSERT INTO Sessions (user_id, session_token, cookie_token, creation_date) " +
                "VALUES ($userId, '${sessionTokens.headerToken}', '${sessionTokens.cookieToken}', " +
                "${Calendar.getInstance().timeInMillis})")
            .setHandler { res ->
                if (res.succeeded()) promise.complete(sessionTokens)
                else promise.fail(res.cause())
            }

        return promise.future()
    }
}
