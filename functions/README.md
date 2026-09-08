# Floating Notes Whisper AI Backend

Firebase Cloud Functions backend for speech transcription, translation, and structured AI summary notes.

## OpenAI API Key Setup

To enable OpenAI Whisper (`whisper-1`) and post-processing LLM transformations (`gpt-4o-mini`), you need an OpenAI API key.

### Option 1: Local Development / Emulator

Copy `.env.example` to `.env` inside the `functions` directory:

```bash
cp .env.example .env
```

Edit `.env` and set your key:

```env
OPENAI_API_KEY=sk-proj-...
```

### Option 2: Deployment via Firebase Secret Manager (Recommended)

Set the secret in Firebase Secret Manager:

```bash
firebase secrets:set OPENAI_API_KEY
```

Or configure standard environment variables before deploying:

```bash
firebase functions:config:set openai.key="sk-proj-..."
firebase deploy --only functions
```
