package com.eir.gdr.entities.character

import com.eir.gdr.db.tryGetString
import io.vertx.ext.sql.ResultSet

data class UserCharacter(
    var id: Int? = null,
    var name: String? = null,
    var fullName: String? = null,
    var type: UserCharacterType? = null,
    var fatherRace: UserCharacterRace? = null,
    var motherRace: UserCharacterRace? = null,
    var hasModifiers: Boolean? = null,
    var photoUrl: String? = null,
    var description: String? = null,
    var background: String? = null,
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
                    r.getString("full_name"),
                    UserCharacterType(
                        r.getInteger("type_id"),
                        r.getString("type_name")
                    ),
                    UserCharacterRace(
                        r.getInteger("father_race_id"),
                        r.getString("father_race_name")
                    ),
                    UserCharacterRace(
                        r.getInteger("mother_race_id"),
                        r.getString("mother_race_name")
                    ),
                    r.getInteger("has_modifiers") == 1,
                    r.tryGetString("photo_url"),
                    r.tryGetString("description"),
                    r.tryGetString("background")
                )
            }
    }
}
