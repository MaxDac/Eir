package com.eir.gdr.entities.character

import io.vertx.ext.sql.ResultSet

data class UserPerk(
    var id: Int? = null,
    var name: String? = null,
    var affectedCharacteristic: List<UserPerkEffect>? = null
) {
    companion object {
        fun getCharacterPerk(rs: ResultSet): List<UserPerk> =
            rs.rows.map { r ->
                UserPerk(
                    r.getInteger("id"),
                    r.getString("name"),
                    listOf(
                        UserPerkEffect(
                            0,
                            r.getInteger("char_id"),
                            r.getString("char_name"),
                            r.getInteger("value")
                        )
                    )
                )
            }
                .groupBy { x -> Pair(x.id, x.name) }
                .map { (key, v) ->
                    val effects = v.flatMap { pp -> pp.affectedCharacteristic ?: listOf() }
                    UserPerk(id = key.first, name = key.second, affectedCharacteristic = effects)
                }
    }
}
