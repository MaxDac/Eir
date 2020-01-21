package com.eir.gdr.routes

import com.eir.gdr.db.catchToResponse
import com.eir.gdr.db.mapToResponse
import com.eir.gdr.db.parseBody
import com.eir.gdr.entities.character.UserCharacter
import com.eir.gdr.logic.CharacterLogic
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import java.lang.Exception

object CharacterRoutes : CustomRoute {
    override fun defineRoutes(router: Router, client: JDBCClient) {
        router.post("/Character/Save").handler { ctx ->
            try {
                val body = ctx.parseBody(UserCharacter::class.java)
                CharacterLogic.save(body!!)(client)
                    .map { ctx.response().end("Ok!") }
            }
            catch (ex: Exception) {
                ctx.mapToResponse(ex)
            }
        }

        router.get("/Character/:name").handler { ctx ->
            try {
                val name = ctx.request().getParam("name")
                CharacterLogic.getByNameComplete(name)(client)
                    .catchToResponse(ctx)
            }
            catch (ex: Exception) {
                ctx.mapToResponse(ex)
            }
        }
    }
}
