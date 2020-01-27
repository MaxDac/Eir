package com.eir.gdr.db

import com.eir.gdr.entities.character.UserCharacter

object Queries {
    val getRaces = "select r.id\n" +
            "      ,r.name\n" +
            "      ,r.description\n" +
            "      ,c1.id                        id_plus\n" +
            "      ,c1.name                      name_plus\n" +
            "      ,c1.type                      type_plus\n" +
            "      ,c2.id                        id_minus\n" +
            "      ,c2.name                      name_minus\n" +
            "      ,c2.type                      type_minus\n" +
            "  from Races                        r\n" +
            "      ,Characteristics              c1\n" +
            "      ,Characteristics              c2\n" +
            " where r.id_attribute_plus          = c1.id\n" +
            "   and r.id_attribute_minus         = c2.id"

    fun getRaceById(raceId: Int) = "${getRaces} \n   and r.id = $raceId"

    val getPerksEffects = "select Effects.id\n" +
            "      ,Effects.value\n" +
            "      ,Perks.id                     perk_id\n" +
            "      ,Perks.name                   perk_name\n" +
            "      ,Characteristics.id           char_id\n" +
            "      ,Characteristics.name         char_name\n" +
            "  from Effects\n" +
            "      ,Characteristics\n" +
            "      ,Perks\n" +
            " where Effects.perk_id              = Perks.id\n" +
            "   and Effects.characteristic_id    = Characteristics.id"

    fun getPerkEffects(perkId: Int) =
        "${getPerksEffects}\n   and Perks.id = $perkId"

    val getCharacterQueryWithoutFilters =
        "select Character.id                         id\n" +
                "      ,Character.name                       name\n" +
                "      ,Character.full_name                  full_name\n" +
                "      ,Character.photo_url                  photo_url\n" +
                "      ,Character.description                description\n" +
                "      ,Character.background                 background\n" +
                "      ,CharacterTypes.id                    type_id\n" +
                "      ,CharacterTypes.name                  type_name\n" +
                "      ,Races.id                             father_race_id\n" +
                "      ,Races.name                           father_race_name\n" +
                "      ,MotherRaces.id                       mother_race_id\n" +
                "      ,MotherRaces.name                     mother_race_name\n" +
                "      ,Character.has_modifiers              has_modifiers\n" +
                "  from Character\n" +
                "      ,CharacterTypes\n" +
                "      ,Races\n" +
                "      ,Races as MotherRaces\n" +
                " where Character.type                       = CharacterTypes.id\n" +
                "   and Character.father_race_id             = Races.id\n" +
                "   and Character.mother_race_id             = MotherRaces.id\n";

    fun getCharacterByName(name: String) =
        "$getCharacterQueryWithoutFilters   and Character.name                       = '$name'"

    fun getCharacterById(id: Int) =
        "$getCharacterQueryWithoutFilters   and Character.id                         = $id"

    fun getCharacterByUserId(userId: Int) =
        "$getCharacterQueryWithoutFilters   and Character.user_id                    = $userId"

    fun getCharacterByRoomId(roomId: Int) =
        getCharacterQueryWithoutFilters

    fun getCharacterCharacteristics(charId: Int, nature: String) =
        "select ch.id\n" +
        "      ,ch.name\n" +
        "      ,ch.type\n" +
        "      ,ch.nature\n" +
        "      ,rel.value\n" +
        "  from CharacterRelCharacteristic               rel\n" +
        "      ,Characteristics                          ch\n" +
        " where rel.character_id                         = $charId\n" +
        "   and rel.characteristic_id                    = ch.id\n" +
        "   and ch.nature                                = '$nature'\n" +
        " order by ch.id, ch.nature"

    val NATURE_ATTRIBUTE = "Caratteristica"
    val NATURE_ABILITY = "Conoscenza"

    fun getCharacterAttributes(charId: Int) =
        getCharacterCharacteristics(charId, NATURE_ATTRIBUTE)

    fun getCharacterAbilities(charId: Int): String {
        val query = getCharacterCharacteristics(charId, NATURE_ABILITY)
        println(query)
        return query
    }

    fun getPerksByCharacter(charId: Int) =
        "select p.id                                 id\n" +
        "      ,p.name                               name\n" +
        "      ,c.id                                 char_id\n" +
        "      ,c.name                               char_name\n" +
        "      ,e.value                              value\n" +
        "  from CharacterRelPerk                     rel\n" +
        "      ,Perks                                p\n" +
        "      ,Effects                              e\n" +
        "      ,Characteristics                      c\n" +
        " where rel.character_id                     = $charId\n" +
        "   and rel.perk_id                          = p.id\n" +
        "   and p.id                                 = e.perk_id\n" +
        "   and e.characteristic_id                  = c.id"

    private val chatRoomQueries =
        "select ce.id\n" +
            "      ,ce.room_id\n" +
            "      ,ce.character_id\n" +
            "      ,ce.creation_date\n" +
            "      ,ce.action\n" +
            "      ,ch.name\n" +
            "  from ChatEntries                      ce\n" +
            "      ,Character                        ch\n" +
            " where ce.character_id                  = ch.id" +
            "   and room_id                          = "

    private val chatRoomQueriesLimit =
        " order by creation_date desc limit 20"

    fun getChatRoomQueries(roomId: Int) =
        "$chatRoomQueries$roomId$chatRoomQueriesLimit"

    val getAllForumSectionsQuery =
        "select sec.id\n" +
                "      ,sec.name\n" +
                "      ,sec.description\n" +
                "  from ForumSections                    sec\n"

    fun getSectionTopics(sectionId: Int) =
        "select top.id\n" +
                "      ,top.title\n" +
                "      ,top.description\n" +
                "      ,$sectionId as section_id\n" +
                "      ,top.creation_date\n" +
                "  from ForumTopic                           top\n" +
                " where top.section_id                       = $sectionId\n"

    fun getTopic(topicId: Int) =
        "select top.id\n" +
                "      ,top.title\n" +
                "      ,top.description\n" +
                "      ,top.section_id\n" +
                "      ,top.creation_date\n" +
                "  from ForumTopic                           top\n" +
                " where top.id                               = $topicId"

    fun getTopicPosts(topicId: Int) =
        "select pst.id\n" +
                "      ,pst.content\n" +
                "      ,usr.id                       user_id\n" +
                "      ,usr.username                 user_name\n" +
                "      ,pst.topic_id                 topic_id\n" +
                "      ,pst.creation_date\n" +
                "  from ForumPost                    pst\n" +
                "      ,Users                        usr\n" +
                " where pst.topic_id                 = $topicId\n" +
                "   and pst.user_id                  = usr.id\n"

    fun getTopicPostById(id: Int) =
        "select pst.id\n" +
                "      ,pst.content\n" +
                "      ,usr.id                       user_id\n" +
                "      ,usr.username                 user_name\n" +
                "      ,pst.topic_id                 topic_id\n" +
                "      ,pst.creation_date\n" +
                "  from ForumPost                    pst\n" +
                "      ,Users                        usr\n" +
                " where pst.id                       = $id\n" +
                "   and pst.user_id                  = usr.id\n"

    fun updateCharacterInfos(character: UserCharacter) =
        "update Character\n" +
                "   set full_name                        = '${character.fullName}'\n" +
                "      ,photo_url                        = '${character.photoUrl}'\n" +
                "      ,description                      = '${character.description}'\n" +
                "      ,background                       = '${character.background}'\n" +
                " where id                               = ${character.id}\n"
}
