package com.eir.gdr.routes

import com.eir.gdr.logic.ChatHandler
import io.vertx.core.Vertx
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.sockjs.BridgeOptions
import io.vertx.ext.web.handler.sockjs.SockJSHandler

class ChatRoutes(private val roomId: Int) : CustomRoutes {
    override fun defineRoutes(vertx: Vertx, client: JDBCClient): Router {
        val options = BridgeOptions()
            .addOutboundPermitted(PermittedOptions().setAddressRegex("out"))
            .addInboundPermitted(PermittedOptions().setAddressRegex("in"))

        val data = vertx.sharedData()
        val eventBus = vertx.eventBus()
        val handler = ChatHandler(eventBus, client, roomId)

        val sockJSHandler = SockJSHandler.create(vertx)
        return sockJSHandler.bridge(options, handler)
    }
}
