package com.eir.gdr.entities

import io.vertx.ext.sql.ResultSet

data class CharacterType (
    val id: Int,
    val name: String,
    val maxMartialAttributes: Int,
    val maxMentalAttributes: Int,
    val maxMartialAbilities: Int,
    val maxMentalAbilities: Int
) {
    companion object {
        fun getTypes(rs: ResultSet): List<CharacterType> =
            rs.rows.map { r ->
                CharacterType(
                    r.getInteger("id"),
                    r.getString("name"),
                    r.getInteger("max_martial_attr"),
                    r.getInteger("max_mental_attr"),
                    r.getInteger("max_martial_ab"),
                    r.getInteger("max_mental_ab")
                )
            }

        val default = CharacterType(
            0,
            "NotDefined",
            0,
            0,
            0,
            0
        )
    }
}
