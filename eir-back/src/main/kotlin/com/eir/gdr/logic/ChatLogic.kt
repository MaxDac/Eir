package com.eir.gdr.logic

import com.eir.gdr.ClientFuture
import com.eir.gdr.bind
import com.eir.gdr.db.Queries
import com.eir.gdr.db.dmlAsync
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.chat.ChatEntry
import com.eir.gdr.entities.chat.ChatEntryRequest
import com.eir.gdr.entities.chat.Room
import java.util.*

object ChatLogic {
    fun getRooms(): ClientFuture<List<Room>> = { client ->
        client.queryAsync("SELECT * FROM Rooms")
            .map { r -> Room.readRooms(r) }
    }

    fun getChatEntriesByRoomId(roomId: Int): ClientFuture<List<ChatEntry>> = { client ->
        client.queryAsync(Queries.getChatRoomQueries(roomId))
            .map { r -> ChatEntry.readChatEntry(r) }
    }

    fun putChatEntrySimple(request: ChatEntryRequest): ClientFuture<Unit> = { client ->
        client.dmlAsync("INSERT INTO ChatEntries (room_id, character_id, creation_date, action)\n" +
                "VALUES (${request.roomId}, ${request.characterId}, ${Calendar.getInstance().timeInMillis}, " +
                "'${request.action}')")
    }

    fun putDiceChatEntry(request: ChatEntryRequest): ClientFuture<Unit> = { client ->
        request.mountPhrase()(client)
            .bind { phrase ->
                client.dmlAsync("INSERT INTO ChatEntries (room_id, character_id, creation_date, action, type)\n" +
                        "VALUES (${request.roomId}, ${request.characterId}, ${Calendar.getInstance().timeInMillis}, " +
                        "'$phrase', 1)")
            }
    }

    fun putChatEntry(request: ChatEntryRequest): ClientFuture<Unit> =
        if (request.isActionSimple) putChatEntrySimple(request) else putDiceChatEntry(request)
}
