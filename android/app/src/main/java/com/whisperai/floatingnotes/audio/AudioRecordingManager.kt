package com.whisperai.floatingnotes.audio

import android.content.Context
import android.media.MediaRecorder
import android.os.Build
import android.util.Log
import java.io.File

class AudioRecordingManager(private val context: Context) {

    private var mediaRecorder: MediaRecorder? = null
    private var isRecording: Boolean = false
    private var outputFile: File? = null

    companion object {
        private const val TAG = "AudioRecordingManager"
        private const val TEMP_FILE_NAME = "temp_recording.m4a"
    }

    fun start(): File? {
        if (isRecording) {
            stop()
        }

        val cacheDir = context.cacheDir
        outputFile = File(cacheDir, TEMP_FILE_NAME)

        mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(context)
        } else {
            @Suppress("DEPRECATION")
            MediaRecorder()
        }.apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setAudioEncodingBitRate(128000)
            setAudioSamplingRate(44100)
            setOutputFile(outputFile?.absolutePath)

            try {
                prepare()
                start()
                isRecording = true
                Log.d(TAG, "Recording started: ${outputFile?.absolutePath}")
            } catch (e: Exception) {
                Log.e(TAG, "MediaRecorder prepare/start failed", e)
                releaseRecorder()
                return null
            }
        }

        return outputFile
    }

    fun stop(): File? {
        if (!isRecording) return outputFile

        try {
            mediaRecorder?.apply {
                stop()
                release()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping MediaRecorder", e)
        } finally {
            mediaRecorder = null
            isRecording = false
        }

        Log.d(TAG, "Recording stopped: ${outputFile?.absolutePath}")
        return outputFile
    }

    fun cancel() {
        if (isRecording) {
            try {
                mediaRecorder?.apply {
                    stop()
                    release()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error stopping MediaRecorder on cancel", e)
            } finally {
                mediaRecorder = null
                isRecording = false
            }
        }

        outputFile?.let { file ->
            if (file.exists()) {
                val deleted = file.delete()
                Log.d(TAG, "Temp recording deleted on cancel: $deleted")
            }
        }
        outputFile = null
    }

    fun isRecording(): Boolean = isRecording

    fun getOutputFile(): File? = outputFile

    private fun releaseRecorder() {
        try {
            mediaRecorder?.release()
        } catch (e: Exception) {
            Log.e(TAG, "Error releasing MediaRecorder", e)
        }
        mediaRecorder = null
        isRecording = false
    }
}
