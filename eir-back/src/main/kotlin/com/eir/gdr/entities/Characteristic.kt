package com.eir.gdr.entities

import io.vertx.ext.sql.ResultSet

data class Characteristic (
    val id: Int,
    val name: String,
    val comments: String,
    val nature: String,
    val type: String,
    val value: Int? = 0
) {
    companion object {
        fun readCharacteristics(rs: ResultSet): List<Characteristic> =
            rs.rows.map { x ->
                Characteristic(
                    x.getInteger("id"),
                    x.getString("name"),
                    x.getString("comments"),
                    x.getString("nature"),
                    x.getString("type")
                )
            }

        fun readUserCharacteristics(rs: ResultSet): List<Characteristic> =
            rs.rows.map { x ->
                Characteristic(
                    x.getInteger("id"),
                    x.getString("name"),
                    "",
                    x.getString("nature"),
                    x.getString("type"),
                    x.getInteger("value")
                )
            }

        val default = Characteristic(
            0,
            "NotDefined",
            "",
            "",
            ""
        )
    }
}
