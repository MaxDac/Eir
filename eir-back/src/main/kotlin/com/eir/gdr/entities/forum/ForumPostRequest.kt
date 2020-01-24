package com.eir.gdr.entities.forum

data class ForumPostRequest(
    var id: Int? = null,
    var content: String? = null,
    var topicId: Int? = null,
    var userId: Int? = null
)
