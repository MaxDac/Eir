package com.eir.gdr.entities

import io.vertx.ext.sql.ResultSet

data class Effect (
    val id: Int,
    val value: Int,
    val perk: Perk,
    val characteristic: Characteristic
) {
    companion object {
        fun getEffects(rs: ResultSet) =
            rs.rows.map { rs ->
                Effect(
                    rs.getInteger("id"),
                    rs.getInteger("value"),
                    Perk(
                        rs.getInteger("perk_id"),
                        rs.getString("perk_name")
                    ),
                    Characteristic(
                        rs.getInteger("char_id"),
                        rs.getString("char_name"),
                        "",
                        "",
                        ""
                    )
                )
            }
    }
}
