package com.eir.gdr.routes

import com.eir.gdr.db.catchToResponse
import com.eir.gdr.db.parseBody
import com.eir.gdr.entities.forum.ForumPostRequest
import com.eir.gdr.entities.forum.ForumTopicRequest
import com.eir.gdr.logic.Exceptions
import com.eir.gdr.logic.ForumLogic
import io.vertx.core.Vertx
import io.vertx.ext.jdbc.JDBCClient
import io.vertx.ext.web.Router

object ForumRoutes : CustomRoutes {
    override fun defineRoutes(vertx: Vertx, client: JDBCClient): Router {
        val router = Router.router(vertx)

        router.get("/Forum/Sections").handler { ctx ->
            ForumLogic.getSections()(client)
                .catchToResponse(ctx)
        }

        router.get("/Forum/Topics/:id").handler { ctx ->
            val id = ctx.request().getParam("id")
            ForumLogic.getTopics(id.toInt())(client)
                .catchToResponse(ctx)
        }

        router.get("/Forum/Topic/:id").handler { ctx ->
            val id = ctx.request().getParam("id")
            ForumLogic.getTopic(id.toInt())(client)
                .catchToResponse(ctx)
        }

        router.get("/Forum/Posts/:id").handler { ctx ->
            val id = ctx.request().getParam("id")
            ForumLogic.getPosts(id.toInt())(client)
                .catchToResponse(ctx)
        }

        router.get("/Forum/Post/:id").handler { ctx ->
            val id = ctx.request().getParam("id")
            ForumLogic.getPost(id.toInt())(client)
                .catchToResponse(ctx)
        }

        router.post("/Forum/Topic").handler { ctx ->
            val body = ctx.parseBody(ForumTopicRequest::class.java)

            if (body == null) ctx.response().end(Exceptions.notFound.toString())
            else {
                ForumLogic.createNewTopic(body)(client)
                    .catchToResponse(ctx)
            }
        }

        router.post("/Forum/Post").handler { ctx ->
            val body = ctx.parseBody(ForumPostRequest::class.java)

            if (body == null) ctx.response().end(Exceptions.notFound.toString())
            else {
                ForumLogic.createNewPost(body)(client)
                    .catchToResponse(ctx)
            }
        }

        router.post("/Forum/Topic/Update").handler { ctx ->
            val body = ctx.parseBody(ForumTopicRequest::class.java)

            if (body == null) ctx.response().end(Exceptions.notFound.toString())
            else {
                ForumLogic.updateTopic(body)(client)
                    .catchToResponse(ctx)
            }
        }

        router.post("/Forum/Post/Update").handler { ctx ->
            val body = ctx.parseBody(ForumPostRequest::class.java)

            if (body == null) ctx.response().end(Exceptions.notFound.toString())
            else {
                ForumLogic.updatePost(body)(client)
                    .catchToResponse(ctx)
            }
        }

        router.post("/Forum/Topic/Delete/:id").handler { ctx ->
            val id = ctx.request().getParam("id")
            ForumLogic.deleteTopic(id.toInt())(client)
                .catchToResponse(ctx)
        }

        router.post("/Forum/Post/Delete/:id").handler { ctx ->
            val id = ctx.request().getParam("id")
            ForumLogic.deletePost(id.toInt())(client)
                .catchToResponse(ctx)
        }

        return router
    }
}
