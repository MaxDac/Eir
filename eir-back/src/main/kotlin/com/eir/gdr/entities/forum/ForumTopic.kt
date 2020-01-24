package com.eir.gdr.entities.forum

import io.vertx.ext.sql.ResultSet

data class ForumTopic(
    val id: Int,
    val title: String,
    val description: String,
    val sectionId: Int,
    val creationDate: Int,
    val posts: Int? = null
) {
    companion object {
        fun readTopics(rs: ResultSet) =
            rs.rows.map { r ->
                ForumTopic(
                    r.getInteger("id"),
                    r.getString("title"),
                    r.getString("description"),
                    r.getInteger("section_id"),
                    r.getInteger("creation_date")
                )
            }
    }
}
