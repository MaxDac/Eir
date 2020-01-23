package com.eir.gdr.entities.chat

import io.vertx.ext.sql.ResultSet

data class Room(
    val id: Int,
    val name: String,
    val description: String
) {
    companion object {
        fun readRooms(rs: ResultSet): List<Room> =
            rs.rows.map { r ->
                Room(
                    r.getInteger("id"),
                    r.getString("name"),
                    r.getString("description")
                )
            }
    }
}
