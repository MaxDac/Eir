package com.eir.gdr.routes

import com.eir.gdr.bind
import com.eir.gdr.db.catchToResponse
import com.eir.gdr.db.mapToResponse
import com.eir.gdr.db.parseBody
import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.getUserFromSession
import com.eir.gdr.logic.CharacterLogic
import com.eir.gdr.logic.CharacterSaveLogic
import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router

object CharacterRoutes : CustomRoutes {
    override fun defineRoutes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

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

        router.get("/Character/Room/:id").handler { ctx ->
            try {
                val userId = ctx.request().getParam("id").toInt()
                CharacterLogic.getByRoomId(userId)(client)
                    .catchToResponse(ctx)
            }
            catch (ex: Exception) {
                ctx.mapToResponse(ex)
            }
        }

        router.post("/Character/Save").handler { ctx ->
            try {
                val body = ctx.parseBody(UserCharacter::class.java)

                if (body != null) {
                    ctx.getUserFromSession(client)
                        .bind { userId ->
                            if (userId != null) {
                                CharacterSaveLogic.save(body, userId)(client)
                            }
                            else {
                                throw Exception("User not found!")
                            }
                        }
                        .catchToResponse(ctx)
                }
                else {
                    throw Exception("Body incomplete!")
                }
            }
            catch (ex: Exception) {
                ctx.mapToResponse(ex)
            }
        }

        router.post("/Character/Update").handler { ctx ->
            val body = ctx.parseBody(UserCharacter::class.java)

            if (body == null) ctx.response().end("Bad request")
            else CharacterLogic.update(body)(client).catchToResponse(ctx)
        }

        return router
    }
}
