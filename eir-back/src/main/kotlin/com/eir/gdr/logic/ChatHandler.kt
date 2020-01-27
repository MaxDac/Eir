package com.eir.gdr.logic

import com.eir.gdr.bind
import com.eir.gdr.entities.chat.ChatEntry
import com.eir.gdr.entities.chat.ChatEntryRequest
import com.eir.gdr.tryGetInt
import com.eir.gdr.tryGetString
import io.vertx.core.Handler
import io.vertx.core.eventbus.EventBus
import io.vertx.core.json.Json
import io.vertx.core.logging.LoggerFactory
import io.vertx.core.shareddata.SharedData
import io.vertx.ext.bridge.BridgeEventType
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.handler.sockjs.BridgeEvent
import java.lang.Exception
import java.util.*
import kotlin.collections.HashMap

class ChatHandler(
    private val eventBus: EventBus,
    private val client: JDBCClient,
    private val roomId: Int
) : Handler<BridgeEvent> {
    private val logger by lazy {
        LoggerFactory.getLogger(ChatHandler::class.java)
    }

    private fun resendChat() =
        ChatLogic.getChatEntriesByRoomId(roomId)(client)
            .setHandler { res ->
                if (res.succeeded()) {
                    eventBus.publish("out", Json.encode(res.result()))
                } else {
                    logger.error(res.cause())
                }
            }

    private fun clientToServer(request: ChatEntryRequest) =
        ChatLogic.putChatEntry(request)(client)
            .bind {
                ChatLogic.getChatEntriesByRoomId(request.roomId!!)(client)
            }
            .setHandler { res ->
                if (res.succeeded()) {
                    eventBus.publish("out", Json.encode(res.result()))
                } else {
                    logger.error(res.cause())
                }
            }

    private fun checkMessage(event: BridgeEvent) {
        val message = event.rawMessage.map["headers"] as HashMap<String, String>
        val (headerToken, cookieToken, room) = Triple(
            message["x-session-header"],
            message["x-session-cookie"],
            message["room"]
        )

        if (headerToken.isNullOrEmpty() || cookieToken.isNullOrEmpty())
            event.socket().close()
        else {
            AuthenticationLogic.checkSessionTokens(headerToken, cookieToken, client)
                .setHandler { res ->
                    if (res.failed() || res.result() == null)
                        event.socket().close()
                }
        }
    }

    override fun handle(event: BridgeEvent?) {
        if (event?.type() == BridgeEventType.SOCKET_CREATED)
            logger.info("A socket was created")

        if (event?.type() == BridgeEventType.REGISTER) {
            logger.info("Registering new socket")
            checkMessage(event)
            resendChat()
        }

        if (event?.type() == BridgeEventType.SEND) {
            try {
                logger.info("this is the body: ${event.rawMessage.map["body"]}")
                val body = event.rawMessage.map["body"] as HashMap<String, Any>
                val decoded = ChatEntryRequest(
                    body.tryGetInt("roomId"),
                    body.tryGetInt("characterId"),
                    body.tryGetString("action"),
                    body.tryGetInt("attributeId"),
                    body.tryGetInt("abilityId"),
                    body.tryGetInt("cd")
                )
                clientToServer(decoded)
            }
            catch (ex: Exception) {
                logger.error("Error while processing the message: $ex")
            }
        }

        event?.complete(true)
    }
}
