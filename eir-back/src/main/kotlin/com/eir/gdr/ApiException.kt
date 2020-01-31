package com.eir.gdr

data class ApiException(
    var apiErrorCode: String? = null,
    var details: String? = null,
    var stack: String? = null
) : Exception(details) {
    companion object {
        val sessionNotFound = ApiException("SES001", "Session not found")
        val insufficientExperience = ApiException("EXP001", "Esperienza insufficiente per aumentare la scheda.")
    }
}
