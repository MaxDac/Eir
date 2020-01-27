package com.eir.gdr

import io.vertx.core.Future
import io.vertx.core.Promise
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.locks.AbstractQueuedSynchronizer
import kotlin.math.pow

val tp: ExecutorService by lazy {
    Executors.newCachedThreadPool()
}

fun <T> async(handler: (Promise<T>) -> Unit): Future<T> = Future.future<T> { p ->
    tp.execute {
        handler(p)
    }
}

sealed class FutureDuration {
    companion object {
        val infinite: FutureDuration = Infinite
        fun seconds(sec: Int): FutureDuration =
            Seconds(sec)
    }
}

private object Infinite : FutureDuration()
private data class Seconds(val seconds: Int) : FutureDuration() {
    val asNano by lazy {
        (this.seconds * nanoInSeconds).toLong()
    }
}

private val nanoInSeconds = 10.0.pow(6.0)

object FutureTimeoutExpiredException : Exception("The timeout set for the future expired.")
object FutureReturnedNullException : Exception("The future returned a null value.")

private class CompletionLatch<T>(
    future: Future<T>,
    private val duration: FutureDuration = Infinite
) : AbstractQueuedSynchronizer(), (Future<T>) -> T? {

    private var _result: T? = null
    private var _error: Throwable? = null

    init {
        future.setHandler { res ->
            if (res.succeeded()) this._result = res.result()
            else this._error = res.cause()

            releaseShared(1)
        }
    }

    @Throws(Exception::class)
    fun result(): T? {
        fun manage(notExistentError: Throwable): T? {
            when {
                this._error != null -> throw this._error!!
                this._result != null -> return this._result
                else -> throw notExistentError
            }
        }

        val whenNotExistent =
            when (this.duration) {
                is Infinite -> {
                    this.acquireSharedInterruptibly(1)
                    FutureReturnedNullException
                }
                is Seconds -> {
                    val elapsed = this.duration.asNano
                    val before = System.currentTimeMillis()
                    val got = this.tryAcquireSharedNanos(1, elapsed)
                    val after = System.currentTimeMillis()
                    FutureTimeoutExpiredException
                }
            }

        return manage(whenNotExistent)
    }

    override fun tryAcquireShared(arg: Int): Int =
        if (state != 0) 1 else -1

    override fun tryReleaseShared(arg: Int): Boolean {
        state = 1
        return true
    }

    override fun invoke(p1: Future<T>): T? {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}

@Throws(Exception::class)
fun <T> Future<T>.awaitResult(duration: FutureDuration = Infinite): T? =
    CompletionLatch(this, duration).result()
