package com.eir.gdr.logic

import com.eir.gdr.ClientFuture
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.Power

object HelpLogic {
    fun getPowers(): ClientFuture<List<Power>> = { client ->
        val query = "SELECT * FROM Powers"
        client.queryAsync(query)
            .map { rs -> Power.getPowers(rs) }
    }
}
