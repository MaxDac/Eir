package com.eir.gdr.logic

import com.eir.gdr.ClientFuture
import com.eir.gdr.db.Queries
import com.eir.gdr.db.dmlAsync
import com.eir.gdr.db.queryAsync
import com.eir.gdr.entities.forum.*
import java.util.*

object ForumLogic {
    private fun creationDate() = Calendar.getInstance().timeInMillis

    fun getSections(): ClientFuture<List<ForumSection>> = { client ->
        client.queryAsync(Queries.getAllForumSectionsQuery)
            .map { rs -> ForumSection.readSections(rs) }
    }

    fun getTopics(sectionId: Int): ClientFuture<List<ForumTopic>> = { client ->
        val query = Queries.getSectionTopics(sectionId)
        client.queryAsync(query)
            .map { rs -> ForumTopic.readTopics(rs) }
    }

    fun getTopic(id: Int): ClientFuture<ForumTopic?> = { client ->
        val query = Queries.getTopic(id)
        client.queryAsync(query)
            .map { rs -> ForumTopic.readTopics(rs).firstOrNull() }
    }

    fun getPosts(topicId: Int): ClientFuture<List<ForumPost>> = { client ->
        client.queryAsync(Queries.getTopicPosts(topicId))
            .map { rs -> ForumPost.getPosts(rs) }
    }

    fun getPost(postId: Int): ClientFuture<ForumPost?> = { client ->
        client.queryAsync(Queries.getTopicPostById(postId))
            .map { rs -> ForumPost.getPosts(rs).firstOrNull() }
    }

    fun createNewTopic(topic: ForumTopicRequest): ClientFuture<Unit> = { client ->
        client.dmlAsync("INSERT INTO ForumTopic (title, description, section_id, creation_date)\n" +
                "VALUES ('${topic.title}', '${topic.description}', ${topic.sectionId}, ${creationDate()})")
    }

    fun createNewPost(post: ForumPostRequest): ClientFuture<Unit> = { client ->
        client.dmlAsync("INSERT INTO ForumPost (user_id, topic_id, content, creation_date)\n" +
                "VALUES (${post.userId}, ${post.topicId}, '${post.content}', ${creationDate()})")
    }

    fun updateTopic(topic: ForumTopicRequest): ClientFuture<Unit> = { client ->
        client.dmlAsync("UPDATE ForumTopic\n" +
                "   SET title                = '${topic.title}'\n" +
                "      ,description          = '${topic.description}'\n" +
                " WHERE id                   = ${topic.id}")
    }

    fun updatePost(post: ForumPostRequest): ClientFuture<Unit> = { client ->
        client.dmlAsync("UPDATE ForumPost\n" +
                "   SET content              = '${post.content}'\n" +
                " WHERE id                   = ${post.id}")
    }

    fun deleteTopic(topicId: Int): ClientFuture<Unit> = { client ->
        client.dmlAsync("DELETE FROM ForumTopic WHERE id = $topicId")
    }

    fun deletePost(postId: Int): ClientFuture<Unit> = { client ->
        client.dmlAsync("DELETE FROM ForumPost WHERE id = $postId")
    }
}
