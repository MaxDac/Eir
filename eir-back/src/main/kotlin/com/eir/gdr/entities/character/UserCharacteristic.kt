package com.eir.gdr.entities.character

import io.vertx.ext.sql.ResultSet

data class UserCharacteristic(
    var id: Int? = null,
    var name: String? = null,
    var value: Int? = null
) {
    companion object {
        val default = UserCharacteristic(
            0,
            "NotDefined",
            0
        )
    }
}

