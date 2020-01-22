package com.eir.gdr.tests.base

import com.eir.gdr.db.Database
import io.vertx.core.Future
import io.vertx.core.Vertx

object TestHelpers {
    fun getVertxInstance() = Vertx.vertx()

    fun getDatabaseClient() = Database.client(getVertxInstance())
}
