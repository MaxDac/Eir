package com.eir.gdr.logic

import com.eir.gdr.ClientFuture
import com.eir.gdr.db.Queries
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.Race

object RaceLogic {
    fun getRaces(): ClientFuture<List<Race>> = { client ->
        client.queryAsync(Queries.getRaces)
            .map { rs -> Race.readRaces(rs) }
    }

    fun getRaceById(raceId: Int): ClientFuture<Race> = { client ->
        client.queryAsync(Queries.getRaceById(raceId))
            .map { rs -> Race.readRaces(rs).first() }
    }
}
