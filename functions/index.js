const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const { OpenAI, toFile } = require("openai");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "25mb" }));

/**
 * Mode definitions:
 * - TRANSLATE: Transcribes in native language and translates to English (or user target language).
 * - SMART_TRANSCRIPT: Whisper transcription cleaned of filler words (um, uh) with proper punctuation, casing, and paragraph breaks.
 * - MEETING_NOTES: Extracts summary + actionable markdown checklists (- [ ] task).
 */

app.post("/transcribeAndTranslateAudio", async (req, res) => {
  try {
    // 1. Authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized: Missing Bearer token" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (authError) {
      return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
    }

    const uid = decodedToken.uid;
    const userRef = db.collection("users").doc(uid);

    // 2. Credit Verification & Deduction (Atomic Transaction)
    // If user document does not exist, auto-provision with default 10 credits
    let remainingCredits = 0;
    try {
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        let credits = 10;

        if (!userDoc.exists) {
          // Auto-provision user document with 10 default credits
          transaction.set(userRef, {
            credits: 9,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          remainingCredits = 9;
        } else {
          credits = userDoc.data().credits ?? 10;
          if (credits <= 0) {
            throw { status: 402, message: "Insufficient credits" };
          }

          transaction.update(userRef, {
            credits: admin.firestore.FieldValue.increment(-1)
          });

          remainingCredits = credits - 1;
        }
      });
    } catch (txError) {
      if (txError.status === 402) {
        return res.status(402).json({ success: false, error: "Insufficient credits" });
      }
      throw txError;
    }

    // 3. Audio & Parameters Extraction
    const { audioBase64, mimeType = "audio/mp4", mode = "SMART_TRANSCRIPT", targetLanguage = "English" } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ success: false, error: "Missing required audioBase64 payload" });
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (!openAiApiKey) {
      return res.status(500).json({ success: false, error: "Server configuration error: Missing OPENAI_API_KEY" });
    }

    const openai = new OpenAI({ apiKey: openAiApiKey });
    const audioFile = await toFile(audioBuffer, "recording.m4a", { type: mimeType });

    // 4. Whisper Speech-To-Text / Translation
    let rawTranscript = "";

    if (mode === "TRANSLATE") {
      const translationResponse = await openai.audio.translations.create({
        file: audioFile,
        model: "whisper-1",
      });
      rawTranscript = translationResponse.text;
    } else {
      const transcriptionResponse = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });
      rawTranscript = transcriptionResponse.text;
    }

    // 5. Post-Processing LLM Prompting based on selected mode
    let processedText = rawTranscript;

    if (mode === "SMART_TRANSCRIPT") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert audio transcript editor. Clean the input transcript by removing filler words (e.g. um, uh, like, you know), fix punctuation, capitalization, and break content into readable paragraphs while preserving original meaning and tone."
          },
          { role: "user", content: rawTranscript }
        ]
      });
      processedText = completion.choices[0]?.message?.content?.trim() || rawTranscript;
    } else if (mode === "MEETING_NOTES") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an executive assistant. Process the transcript and format it into clean Markdown meeting notes. Include:\n1. ## Summary (a brief overview)\n2. ## Key Discussion Points\n3. ## Action Items (using markdown checkboxes `- [ ] task`)"
          },
          { role: "user", content: rawTranscript }
        ]
      });
      processedText = completion.choices[0]?.message?.content?.trim() || rawTranscript;
    } else if (mode === "TRANSLATE" && targetLanguage && targetLanguage !== "English") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Translate the following English transcript into ${targetLanguage}. Maintain tone and accuracy.`
          },
          { role: "user", content: rawTranscript }
        ]
      });
      processedText = completion.choices[0]?.message?.content?.trim() || rawTranscript;
    }

    // 6. Return Structured JSON Response
    return res.status(200).json({
      success: true,
      text: processedText,
      remainingCredits: remainingCredits
    });

  } catch (error) {
    console.error("Error processing audio transcription:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
});

exports.transcribeAndTranslateAudio = functions.https.onRequest(app);
