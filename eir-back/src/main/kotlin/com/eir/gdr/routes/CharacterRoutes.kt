package com.eir.gdr.routes

import com.eir.gdr.bind
import com.eir.gdr.db.catchToResponse
import com.eir.gdr.db.mapToResponse
import com.eir.gdr.db.parseBody
import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.getUserFromSession
import com.eir.gdr.logic.CharacterLogic
import com.eir.gdr.logic.CharacteristicLogic
import com.eir.gdr.logic.addEmptyAbilities
import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import java.lang.Exception

object CharacterRoutes : CustomRoutes {
    override fun defineRoutes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        router.get("/Character/:id").handler { ctx ->
            try {
                val id = ctx.request().getParam("id").toInt()
                CharacterLogic.getCharacterComplete { CharacterLogic.getById(id) }(client)
                    .flatMap { c ->
                        CharacteristicLogic.getAbilities()(client)
                            .map { chs -> c?.addEmptyAbilities(chs.filter { x -> x.nature == "Conoscenza" }) }
                    }
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
                ctx.getUserFromSession(client)
                    .bind { userId ->
                        CharacterLogic.save(body, userId)(client)
                    }
                    .catchToResponse(ctx)
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
