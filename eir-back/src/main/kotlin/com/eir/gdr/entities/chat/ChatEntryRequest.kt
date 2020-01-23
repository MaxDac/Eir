package com.eir.gdr.entities.chat

data class ChatEntryRequest(
    var roomId: Int? = null,
    var characterId: Int? = null,
    var action: String? = null
)

