package com.eir.gdr.entities

import io.vertx.ext.sql.ResultSet

data class Race (
    val id: Int,
    val name: String,
    val description: String?,
    val maxAttribute: Characteristic,
    val minAttribute: Characteristic
) {
    companion object {
        fun readRaces(rs: ResultSet): List<Race> =
            rs.rows.map { x ->
                Race(
                    x.getInteger("id"),
                    x.getString("name"),
                    x.getString("description"),
                    Characteristic(
                        x.getInteger("id_plus"),
                        x.getString("name_plus"),
                        "",
                        "",
                        x.getString("type_plus")
                    ),
                    Characteristic(
                        x.getInteger("id_minus"),
                        x.getString("name_minus"),
                        "",
                        "",
                        x.getString("type_minus")
                    )
                )
            }

        val default = Race(
            0,
            "NotDefined",
            null,
            Characteristic.default,
            Characteristic.default
        )
    }
}
