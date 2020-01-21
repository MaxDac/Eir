package com.eir.gdr.entities

import io.vertx.ext.sql.ResultSet

data class Perk (
    var id: Int? = null,
    var name: String? = null,
    var description: String? = null,
    var negative: Boolean? = null,
    var affectedCharacteristic: List<Effect>? = null
) {
    companion object {
        fun getPerks(rs: ResultSet): List<Perk> =
            rs.rows.map { r ->
                Perk(
                    r.getInteger("id"),
                    r.getString("name"),
                    r.getString("description"),
                    r.getInteger("isNegative") == 1
                )
            }
    }
}
