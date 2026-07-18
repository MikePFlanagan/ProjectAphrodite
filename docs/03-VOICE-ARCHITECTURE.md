# Voice Architecture

Project Aphrodite treats voice as a presentation layer around the same character identity, prompts, memory, safety policy, and usage controls used by text chat. A voice provider must never become a second character brain.

## Provider contract

Every character stores a provider-neutral voice profile:

- `voiceProvider`: `browser`, `local`, or `telnyx`
- `voiceId`: the provider-specific voice identifier
- `voiceRate`: delivery speed from `0.5` to `2.0`
- `voicePitch`: pitch from `0.5` to `2.0`

Unknown or unavailable voice identifiers fall back safely to the provider default. Secrets and provider credentials are never stored on the character.

## Current foundation

Creator Studio can configure and persist a voice profile and preview a character greeting with the browser's device voices. This path requires no Aphrodite API key and gives creators an immediate voice-design loop. Device voice availability and whether synthesis is fully on-device are controlled by the user's browser and operating system, so this preview is not described as the self-hosted production service.

## Local-first production path

The planned local voice service preserves the same profile and routes audio through:

1. Browser WebRTC transport
2. Voice activity detection
3. Local speech-to-text
4. Aphrodite conversation API, prompts, memory, safety, and limits
5. Local text-to-speech
6. Browser WebRTC playback

The initial implementation target is Pipecat with Silero VAD, faster-whisper, and a license-reviewed local speech engine. A self-hosted LiveKit transport can replace the development WebRTC transport when concurrency and room management require it. Ollama may be added as a local model fallback without changing the voice contract.

Telnyx remains an optional managed transport for teams that prefer carrier infrastructure. Phone numbers, PSTN calls, and SMS require a carrier and are intentionally outside the free local-browser path.

## Safety and privacy invariants

- Voice sessions require the same authenticated conversation ownership checks as text chat.
- Audio is not retained by default.
- Microphone use is explicit and visibly active.
- Transcripts pass through the same message limits, persistence rules, memory extraction, and safety disclosures as typed messages.
- Provider failures must stop capture, preserve already-saved text, and give the user a recoverable fallback.
