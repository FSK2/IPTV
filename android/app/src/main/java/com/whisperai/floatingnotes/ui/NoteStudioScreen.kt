package com.whisperai.floatingnotes.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.whisperai.floatingnotes.audio.AudioRecordingManager
import com.whisperai.floatingnotes.network.ServerAiClient
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File

enum class AiProcessingMode {
    TRANSLATE,
    SMART_TRANSCRIPT,
    MEETING_NOTES
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NoteStudioScreen(
    serverAiClient: ServerAiClient,
    getFirebaseIdToken: suspend () -> String,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val recordingManager = remember { AudioRecordingManager(context) }

    var textValue by remember { mutableStateOf("") }
    var selectedMode by remember { mutableStateOf(AiProcessingMode.SMART_TRANSCRIPT) }
    var isRecording by remember { mutableStateOf(false) }
    var isProcessing by remember { mutableStateOf(false) }
    var recordingTimeSeconds by remember { mutableStateOf(0) }
    var currentAmplitude by remember { mutableStateOf(0) }
    var statusMessage by remember { mutableStateOf<String?>(null) }
    var remainingCredits by remember { mutableStateOf<Int?>(null) }

    // Timer effect & amplitude polling during active recording
    LaunchedEffect(isRecording) {
        if (isRecording) {
            recordingTimeSeconds = 0
            while (isRecording) {
                delay(100L) // Poll amplitude every 100ms
                currentAmplitude = recordingManager.getMaxAmplitude()
                if (System.currentTimeMillis() % 1000 < 100) {
                    recordingTimeSeconds++
                }
            }
        } else {
            currentAmplitude = 0
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Mode Selector Bar
        Text("AI Mode", style = MaterialTheme.typography.titleMedium)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = selectedMode == AiProcessingMode.SMART_TRANSCRIPT,
                onClick = { selectedMode = AiProcessingMode.SMART_TRANSCRIPT },
                label = { Text("Smart Transcript") }
            )
            FilterChip(
                selected = selectedMode == AiProcessingMode.TRANSLATE,
                onClick = { selectedMode = AiProcessingMode.TRANSLATE },
                label = { Text("Translate") }
            )
            FilterChip(
                selected = selectedMode == AiProcessingMode.MEETING_NOTES,
                onClick = { selectedMode = AiProcessingMode.MEETING_NOTES },
                label = { Text("Meeting Notes") }
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Note Editor TextField
        OutlinedTextField(
            value = textValue,
            onValueChange = { textValue = it },
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            label = { Text("Floating Note Content") },
            placeholder = { Text("Record audio or type your notes here...") },
            enabled = !isProcessing
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Live Recording HUD Banner with Waveform Visualizer
        AnimatedVisibility(visible = isRecording) {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // Pulsing visualizer indicator based on live amplitude
                            val normAmplitude = (currentAmplitude.toFloat() / 32767f).coerceIn(0.1f, 1.0f)
                            val indicatorSize = (12 * (1f + normAmplitude * 0.5f)).dp

                            Box(
                                modifier = Modifier
                                    .size(indicatorSize)
                                    .clip(RoundedCornerShape(indicatorSize / 2))
                                    .background(Color.Red)
                            )
                            val minutes = recordingTimeSeconds / 60
                            val seconds = recordingTimeSeconds % 60
                            Text(
                                text = String.format("%02d:%02d", minutes, seconds),
                                style = MaterialTheme.typography.bodyLarge
                            )
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            // Cancel button: stops recording & deletes temp file without sending
                            TextButton(
                                onClick = {
                                    recordingManager.cancel()
                                    isRecording = false
                                    statusMessage = "Recording cancelled"
                                }
                            ) {
                                Text("Cancel", color = MaterialTheme.colorScheme.error)
                            }

                            // Done button: stops recording & sends file to server
                            Button(
                                onClick = {
                                    val recordedFile = recordingManager.stop()
                                    isRecording = false
                                    if (recordedFile != null && recordedFile.exists() && recordedFile.length() > 0L) {
                                        isProcessing = true
                                        statusMessage = "Transcribing with Whisper AI..."
                                        coroutineScope.launch {
                                            try {
                                                val token = getFirebaseIdToken()
                                                val result = serverAiClient.processAudio(
                                                    audioFile = recordedFile,
                                                    mode = selectedMode.name,
                                                    idToken = token
                                                )
                                                result.fold(
                                                    onSuccess = { response ->
                                                        val newText = response.text ?: ""
                                                        textValue = if (textValue.isBlank()) {
                                                            newText
                                                        } else {
                                                            "$textValue\n\n$newText"
                                                        }
                                                        remainingCredits = response.remainingCredits
                                                        statusMessage = "Processed successfully!"
                                                    },
                                                    onFailure = { error ->
                                                        statusMessage = "Error: ${error.message}"
                                                    }
                                                )
                                            } catch (e: Exception) {
                                                statusMessage = "Failed: ${e.message}"
                                            } finally {
                                                isProcessing = false
                                            }
                                        }
                                    } else {
                                        statusMessage = "Recording failed: Audio file is empty or missing"
                                    }
                                }
                            ) {
                                Text("Done")
                            }
                        }
                    }

                    // Simple Live Waveform Amplitude Bar Visualizer
                    Spacer(modifier = Modifier.height(8.dp))
                    val normAmplitude = (currentAmplitude.toFloat() / 32767f).coerceIn(0.05f, 1.0f)
                    LinearProgressIndicator(
                        progress = { normAmplitude },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            }
        }

        // Loading Indicator during server AI processing
        if (isProcessing) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Text("Processing audio with Whisper AI...", style = MaterialTheme.typography.bodyMedium)
            }
        }

        // Status & Credits info bar
        statusMessage?.let { msg ->
            Text(
                text = msg,
                style = MaterialTheme.typography.bodySmall,
                color = if (msg.startsWith("Error") || msg.startsWith("Failed")) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }

        remainingCredits?.let { credits ->
            Text(
                text = "Remaining Credits: $credits",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.secondary
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Main Action Button ("Record Audio & Run AI")
        if (!isRecording) {
            Button(
                onClick = {
                    statusMessage = null
                    val startedFile = recordingManager.start()
                    if (startedFile != null) {
                        isRecording = true
                    } else {
                        statusMessage = "Failed to start microphone recording"
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = !isProcessing
            ) {
                Text("Record Audio & Run AI (${selectedMode.name.replace("_", " ")})")
            }
        }
    }
}
