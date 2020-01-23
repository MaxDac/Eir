package com.eir.gdr.routes

import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router

interface CustomRoutes {
    fun defineRoutes(vertx: Vertx, client: JDBCClient): Router
}
