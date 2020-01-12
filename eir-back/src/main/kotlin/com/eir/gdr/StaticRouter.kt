package com.eir.gdr

import io.vertx.core.Vertx
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler

object StaticRouter {
    private val regex = Regex("^([a-zA-Z]*)\$")

    private fun staticHandler(): StaticHandler =
        StaticHandler.create()
            .setCachingEnabled(false)

    fun routes(vertx: Vertx): Router {
        val router = Router.router(vertx)

        router.get("/:menuItem").handler { ctx ->
            val menu = ctx.request().getParam("menuItem")

            if (regex.matches(menu))
                ctx.reroute("/?route=${menu}")
            else
                ctx.next()
        }

        router.get("/*").handler(staticHandler())

        return router
    }
}
