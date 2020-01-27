package com.eir.gdr.tests

import com.eir.gdr.entities.forum.ForumTopicRequest
import com.eir.gdr.logic.ForumLogic
import com.eir.gdr.tests.base.TestHelpers
import com.eir.gdr.awaitResult
import org.junit.Test
import org.junit.jupiter.api.assertDoesNotThrow
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class ForumTests {
    val client by lazy { TestHelpers.getDatabaseClient() }

    @Test
    fun topicInsertionTest() {
        val topicRequest = ForumTopicRequest(
            title = "test_topic",
            description = "Test description",
            sectionId = 1
        )

        assertDoesNotThrow {
            ForumLogic.createNewTopic(topicRequest)(client).awaitResult()
        }

        val topic = ForumLogic.getTopics(1)(client)
            .awaitResult()
            ?.filter { x -> x.title == "test_topic" }
            ?.first()

        assertNotNull(topic)

        assertDoesNotThrow {
            ForumLogic.deleteTopic(topic.id)(client).awaitResult()
        }

        val secondTopic = ForumLogic.getTopics(1)(client)
            .awaitResult()
            ?.filter { x -> x.title == "test_topic" }
            ?.firstOrNull()

        assertNull(secondTopic)
    }

    @Test
    fun topicUpdateTest() {
        val topicRequest = ForumTopicRequest(
            title = "test_topic",
            description = "Test description",
            sectionId = 1
        )

        val topicUpdateRequest = ForumTopicRequest(
            title = "test_topic_updated",
            description = "Test description updated",
            sectionId = 1
        )

        assertDoesNotThrow {
            ForumLogic.createNewTopic(topicRequest)(client).awaitResult()
        }

        val topic = ForumLogic.getTopics(1)(client)
            .awaitResult()
            ?.filter { x -> x.title == "test_topic" }
            ?.first()

        assertNotNull(topic)

        topicUpdateRequest.id = topic.id

        assertDoesNotThrow {
            ForumLogic.updateTopic(topicUpdateRequest)(client).awaitResult()
        }

        val updatedTopic = ForumLogic.getTopics(1)(client)
            .awaitResult()
            ?.filter { x -> x.title == topicUpdateRequest.title }
            ?.first()

        assertNotNull(updatedTopic)
        assertEquals(topicUpdateRequest.title, updatedTopic.title)
        assertEquals(topicUpdateRequest.description, updatedTopic.description)

        assertDoesNotThrow {
            ForumLogic.deleteTopic(updatedTopic.id)(client).awaitResult()
        }

        val secondTopic = ForumLogic.getTopics(1)(client)
            .awaitResult()
            ?.filter { x -> x.title == "test_topic" }
            ?.firstOrNull()

        assertNull(secondTopic)
    }
}
