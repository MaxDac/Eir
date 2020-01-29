package com.eir.gdr

data class ApiException(
    var apiErrorCode: String? = null,
    var details: String? = null,
    var stack: String? = null
) {
    companion object {
        val sessionNotFound = ApiException("SES001", "Session not found")
    }
}
