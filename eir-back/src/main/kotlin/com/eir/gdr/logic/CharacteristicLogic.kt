package com.eir.gdr.logic

import com.eir.gdr.ClientFuture
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.Characteristic
import com.eir.gdr.routes.HelpRoutes

object CharacteristicLogic {
    fun getCharacteristicById(id: Int): ClientFuture<Characteristic?> = { client ->
        client.queryAsync("SELECT * FROM Characteristics WHERE id = $id")
            .map { rs -> Characteristic.readCharacteristics(rs).firstOrNull() }
    }

    fun getAbilities(): ClientFuture<List<Characteristic>> = { client ->
        client.queryAsync("SELECT * FROM Characteristics WHERE nature = '${HelpRoutes.abilityNature}'")
            .map { rs -> Characteristic.readCharacteristics(rs) }
    }
}
