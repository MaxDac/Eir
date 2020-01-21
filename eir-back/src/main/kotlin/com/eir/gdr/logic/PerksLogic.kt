package com.eir.gdr.logic

import com.eir.gdr.db.Queries
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.Effect
import com.eir.gdr.entities.Perk
import io.vertx.core.Future
import io.vertx.ext.jdbc.JDBCClient

object PerksLogic {

    fun getPerks(dbClient: JDBCClient) =
        dbClient.queryAsync("SELECT * FROM Perks")
            .map { x -> Perk.getPerks(x) }

    fun getPerksEffects(dbClient: JDBCClient) =
        dbClient.queryAsync(Queries.getPerksEffects)
            .map { x -> Effect.getEffects(x) }

    fun getPerksWithEffects(dbClient: JDBCClient): Future<List<Perk>> {
        val perks = getPerks(dbClient)
        val effects = getPerksEffects(dbClient)
            .map { res ->
                res.groupBy { e -> e.perk!!.id!! }
            }

        return perks
            .flatMap { p ->
                effects.map { e -> Pair(p, e) }
            }
            .map { (p, e) ->
                p.map { pp ->
                    pp.copy(affectedCharacteristic = e[pp.id])
                }
            }
    }

}
