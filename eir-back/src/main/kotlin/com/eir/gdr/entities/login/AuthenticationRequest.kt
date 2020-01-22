package com.eir.gdr.entities.login

import com.eir.gdr.toMD5

data class AuthenticationRequest(
    var username: String? = null,
    var password: String? = null
) {
    fun isValid(): Boolean = !username.isNullOrEmpty() && !password.isNullOrEmpty()

    val encryptedPassword by lazy {
        password?.toMD5()
    }
}
