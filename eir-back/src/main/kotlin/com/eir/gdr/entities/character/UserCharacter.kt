package com.eir.gdr.entities.character

import com.eir.gdr.entities.CharacterType
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.entities.Perk
import com.eir.gdr.entities.Race
import io.vertx.ext.sql.ResultSet

data class UserCharacter(
    var id: Int? = null,
    var name: String? = null,
    var type: UserCharacterType? = null,
    var race: UserCharacterRace? = null,
    var martialAttributes: List<UserCharacteristic>? = null,
    var mentalAttributes: List<UserCharacteristic>? = null,
    var martialAbilities: List<UserCharacteristic>? = null,
    var mentalAbilities: List<UserCharacteristic>? = null,
    var perks: List<UserPerk>? = null
) {
    companion object {
        fun readCharacterMinimal(rs: ResultSet): List<UserCharacter> =
            rs.rows.map { r ->
                UserCharacter(
                    r.getInteger("id"),
                    r.getString("name"),
                    UserCharacterType(
                        r.getInteger("type_id"),
                        r.getString("type_name")
                    ),
                    UserCharacterRace(
                        r.getInteger("race_id"),
                        r.getString("race_name")
                    )
                )
            }
    }
}
