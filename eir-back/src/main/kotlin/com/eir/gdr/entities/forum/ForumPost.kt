package com.eir.gdr.entities.forum

import com.eir.gdr.entities.login.User
import io.vertx.ext.sql.ResultSet

data class ForumPost(
    val id: Int,
    val content: String,
    val topicId: Int,
    val creationDate: Int,
    val user: User? = null
) {
    companion object {
        fun getPosts(rs: ResultSet) =
            rs.rows.map { r ->
                ForumPost(
                    r.getInteger("id"),
                    r.getString("content"),
                    r.getInteger("topic_id"),
                    r.getInteger("creation_date"),
                    User(
                        r.getInteger("user_id"),
                        r.getString("user_name")
                    )
                )
            }
    }
}
