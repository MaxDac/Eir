package com.eir.gdr.entities.forum

import io.vertx.ext.sql.ResultSet

data class ForumSection(
    val id: Int,
    val name: String,
    val description: String,
    val topics: Int? = null
) {
    companion object {
        fun readSections(rs: ResultSet) =
            rs.rows.map { r ->
                ForumSection(
                    r.getInteger("id"),
                    r.getString("name"),
                    r.getString("description")
                )
            }
    }
}
