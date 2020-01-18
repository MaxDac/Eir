package com.eir.gdr.db

import io.vertx.core.*
import io.vertx.core.json.JsonObject
import io.vertx.ext.jdbc.JDBCClient

object Database {
    val url = "jdbc:sqlite:eir.db"
    val config = JsonObject()
        .put("url", url)
        .put("max_pool_size", 30)

    fun client(vertx: Vertx): JDBCClient = JDBCClient.createShared(vertx,
        config
    )

    fun getConnection(client: JDBCClient) = client.getConnectionAsync()

    fun testDatabase(vertx: Vertx) =
        getConnection(
            client(
                vertx
            )
        )
        .flatMap { c -> c.queryAsync("SELECT * FROM BOOKS") }
        .map { rs -> rs.rows }
        .map { rs ->
            rs.forEach { o ->
                println("Id: ${o.getInteger("Id")}")
                println("Code: ${o.getString("Code")}")
                println("Name: ${o.getString("Name")}")
                println(rs.size)
            }
        }
}
