package com.eir.gdr.routes

import com.eir.gdr.db.Queries
import com.eir.gdr.db.catchToResponse
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.CharacterType
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.entities.Race
import com.eir.gdr.logic.CharacteristicLogic
import com.eir.gdr.logic.PerksLogic
import com.eir.gdr.logic.RaceLogic
import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router

object HelpRoutes : CustomRoutes {
    val attributeNature = "Caratteristica";
    val abilityNature = "Conoscenza";

    override fun defineRoutes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        router.get("/Abilities").handler { ctx ->
            CharacteristicLogic.getAbilities()(client)
                .catchToResponse(ctx)
        }

        router.get("/Characteristics").handler { ctx ->
            client.queryAsync("SELECT * FROM Characteristics WHERE nature = '$attributeNature'")
                .map { rs -> Characteristic.readCharacteristics(rs) }
                .catchToResponse(ctx)
        }

        router.get("/Races").handler { ctx ->
            RaceLogic.getRaces()(client)
                .catchToResponse(ctx)
        }

        router.get("/CharacterTypes").handler { ctx ->
            client.queryAsync("SELECT * FROM CharacterTypes")
                .map { rs -> CharacterType.getTypes(rs) }
                .catchToResponse(ctx)
        }

        router.get("/Perks").handler { ctx ->
            PerksLogic.getPerksWithEffects(client)
                .catchToResponse(ctx)
        }

        return router
    }
}
