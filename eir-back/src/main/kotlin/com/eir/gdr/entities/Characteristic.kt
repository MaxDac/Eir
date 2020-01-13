package com.eir.gdr.entities

import io.vertx.ext.sql.ResultSet

data class Characteristic (
    val id: Int,
    val name: String,
    val comments: String?,
    val type: String
) {
    companion object {
        fun readCharacteristics(rs: ResultSet): List<Characteristic> =
            rs.rows.map { x ->
                Characteristic(
                    x.getInteger("id"),
                    x.getString("name"),
                    x.getString("comments"),
                    x.getString("type")
                )
            }
    }
}
