package com.eir.gdr.entities.login

data class User(
    val id: Int,
    val username: String,
    val email: String? = null
)
