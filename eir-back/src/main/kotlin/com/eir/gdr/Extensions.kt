package com.eir.gdr

import io.vertx.core.Future

fun <T> List<List<T>>.flatten(): List<T> {
    tailrec fun f(source: List<List<T>>, acc: List<T> = listOf()): List<T> {
        if (source.isEmpty()) return acc

        return f(source.drop(1), source.first() + acc)
    }

    return f(this)
}

fun <T, Q> Future<T>.bind(f: (T) -> Future<Q>): Future<Q> =
    Future.future { p ->
        this.setHandler { res ->
            if (res.succeeded()) {
                try {
                    f(res.result()).setHandler { res2 ->
                        if (res2.succeeded()) p.complete(res2.result())
                        else p.fail(res2.cause())
                    }
                }
                catch (ex: Exception) {
                    p.fail(ex)
                }
            }
            else {
                p.fail(res.cause())
            }
        }
    }
