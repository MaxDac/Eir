package com.eir.gdr.entities.chat

import io.vertx.ext.sql.ResultSet

data class ChatEntry(
    val id: Int,
    val roomId: Int,
    val characterId: Int,
    val characterName: String,
    val creationDate: Int,
    val action: String
) {
    companion object {
        fun readChatEntry(rs: ResultSet): List<ChatEntry> =
            rs.rows.map { r ->
                ChatEntry(
                    r.getInteger("id"),
                    r.getInteger("room_id"),
                    r.getInteger("character_id"),
                    r.getString("name"),
                    r.getInteger("creation_date"),
                    r.getString("action")
                )
            }
    }
}
