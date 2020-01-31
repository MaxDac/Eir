package com.eir.gdr.entities

import com.eir.gdr.db.tryGetString
import io.vertx.ext.sql.ResultSet

data class Power(
    val id: Int,
    val name: String,
    val description: String? = null
) {
    companion object {
        fun getPowers(rs: ResultSet): List<Power> =
            rs.rows.map { r ->
                Power(
                    r.getInteger("id"),
                    r.getString("name"),
                    r.tryGetString("description")
                )
            }
    }
}
