package com.eir.gdr.entities.login

import java.util.*

data class SessionTokens(
    val headerToken: String,
    val cookieToken: String,
    var userId: Int? = null
) {
    companion object {
        fun generateNewTokens(): SessionTokens =
            SessionTokens(
                UUID.randomUUID().toString(),
                UUID.randomUUID().toString()
            )
    }
}
