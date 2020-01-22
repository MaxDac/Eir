package com.eir.gdr.routes

import com.eir.gdr.bind
import com.eir.gdr.db.catchToResponse
import com.eir.gdr.db.mapToResponse
import com.eir.gdr.db.parseBody
import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.getUserFromSession
import com.eir.gdr.logic.CharacterLogic
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import java.lang.Exception

object CharacterRoutes : CustomRoutes {
    override fun defineRoutes(router: Router, client: JDBCClient) {
        router.post("/Character/Save").handler { ctx ->
            try {
                val body = ctx.parseBody(UserCharacter::class.java)
                ctx.getUserFromSession(client)
                    .bind { userId ->
                        CharacterLogic.save(body, userId)(client)
                    }
                    .map { ctx.response().end("Ok!") }
            }
            catch (ex: Exception) {
                ctx.mapToResponse(ex)
            }
        }

        router.get("/Character/:id").handler { ctx ->
            try {
                val id = ctx.request().getParam("id").toInt()
                CharacterLogic.getCharacterComplete { CharacterLogic.getById(id) }(client)
                    .catchToResponse(ctx)
            }
            catch (ex: Exception) {
                ctx.mapToResponse(ex)
            }
        }

        router.get("/Character/User/:id").handler { ctx ->
            try {
                val userId = ctx.request().getParam("id").toInt()
                CharacterLogic.getByUserId(userId)(client)
                    .catchToResponse(ctx)
            }
            catch (ex: Exception) {
                ctx.mapToResponse(ex)
            }
        }

        router.get("/Something").handler { ctx ->
            ctx.response().end("Something!")
        }
    }
}
