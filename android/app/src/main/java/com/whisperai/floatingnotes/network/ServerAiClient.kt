package com.whisperai.floatingnotes.network

import android.util.Base64
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.File
import java.util.concurrent.TimeUnit

class ServerAiClient(
    private val baseUrl: String,
    private val client: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()
) {

    data class TranscriptionResponse(
        val success: Boolean,
        val text: String?,
        val remainingCredits: Int?,
        val error: String?
    )

    suspend fun processAudio(
        audioFile: File,
        mode: String = "SMART_TRANSCRIPT",
        idToken: String,
        targetLanguage: String = "English"
    ): Result<TranscriptionResponse> = withContext(Dispatchers.IO) {
        try {
            if (!audioFile.exists() || audioFile.length() == 0L) {
                return@withContext Result.failure(IllegalArgumentException("Audio file is empty or does not exist"))
            }

            val audioBytes = audioFile.readBytes()
            val audioBase64 = Base64.encodeToString(audioBytes, Base64.NO_WRAP)

            val jsonPayload = JSONObject().apply {
                put("audioBase64", audioBase64)
                put("mimeType", "audio/mp4")
                put("mode", mode)
                put("targetLanguage", targetLanguage)
            }

            val requestBody = jsonPayload.toString().toRequestBody("application/json; charset=utf-8".toMediaType())

            val request = Request.Builder()
                .url("$baseUrl/transcribeAndTranslateAudio")
                .addHeader("Authorization", "Bearer $idToken")
                .addHeader("Content-Type", "application/json")
                .post(requestBody)
                .build()

            client.newCall(request).execute().use { response ->
                val responseBodyStr = response.body?.string() ?: ""

                if (!response.isSuccessful) {
                    val errorMsg = try {
                        val errorJson = JSONObject(responseBodyStr)
                        errorJson.optString("error", "HTTP Error ${response.code}")
                    } catch (e: Exception) {
                        "HTTP Error ${response.code}: ${response.message}"
                    }
                    return@withContext Result.failure(Exception(errorMsg))
                }

                val jsonResponse = JSONObject(responseBodyStr)
                val success = jsonResponse.optBoolean("success", false)

                if (success) {
                    val text = jsonResponse.optString("text", "")
                    val remainingCredits = if (jsonResponse.has("remainingCredits")) {
                        jsonResponse.getInt("remainingCredits")
                    } else {
                        null
                    }
                    Result.success(
                        TranscriptionResponse(
                            success = true,
                            text = text,
                            remainingCredits = remainingCredits,
                            error = null
                        )
                    )
                } else {
                    val error = jsonResponse.optString("error", "Unknown processing error")
                    Result.failure(Exception(error))
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
