package com.eir.gdr.routes

import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router

interface CustomRoute {
    fun defineRoutes(router: Router, client: JDBCClient)
}
