package com.eir.gdr.entities.forum

data class ForumTopicRequest(
    var id: Int? = null,
    var title: String? = null,
    var description: String? = null,
    var sectionId: Int? = null
)
