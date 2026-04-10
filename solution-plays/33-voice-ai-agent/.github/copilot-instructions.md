---
description: "Voice AI Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Voice AI Agent — Domain Knowledge

This workspace implements an autonomous voice AI agent — real-time conversation with intent detection, slot filling, dynamic responses, call transfer, and multi-turn dialog management.

## Voice Agent Architecture (What the Model Gets Wrong)

### Real-Time Conversation Loop
```python
# Full duplex: listen while speaking (not half-duplex)
async def voice_agent_loop(call_session):
    while call_session.active:
        # 1. Continuous STT (don't wait for silence)
        utterance = await stt.get_next_utterance(call_session.audio_stream)
        
        # 2. Intent + slot extraction (structured output)
        intent = await classify_intent(utterance, dialog_state)
        # {"intent": "book_appointment", "slots": {"date": "tomorrow", "time": null}}
        
        # 3. Dialog management
        if intent.has_missing_slots():
            response = generate_slot_filling_prompt(intent)  # "What time works for you?"
        elif intent.requires_action():
            result = await execute_action(intent)  # Book the appointment
            response = generate_confirmation(result)
        elif intent.is_transfer():
            await transfer_to_human(call_session, intent.department)
            return
        
        # 4. TTS with SSML for natural prosody
        await tts.speak(call_session, response, voice="en-US-JennyNeural")
```

### Dialog State Management
```python
class DialogState:
    intent_history: list[str]      # Track conversation flow
    filled_slots: dict             # Accumulated slot values
    turn_count: int                # Detect stuck conversations
    sentiment: str                 # Escalate if frustrated
    
    def should_escalate(self) -> bool:
        return (self.turn_count > 8 or           # Too many turns
                self.sentiment == "frustrated" or  # User upset
                self.intent_history[-3:] == ["unknown"] * 3)  # 3 failed intents
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Half-duplex (stop listening while speaking) | User can't interrupt (barge-in) | Full-duplex: listen continuously |
| No slot filling | Asks for all info at once | Incremental: ask one slot at a time |
| No escalation logic | User stuck in AI loop | Escalate after 3 failed intents or frustration |
| Text-only intent detection | Misses tone, urgency | Combine text + audio features (pitch, speed) |
| No conversation timeout | Abandoned calls stay open | 30s silence timeout → "Are you still there?" |
| Same voice for all brands | Generic, no brand identity | Custom Neural Voice per brand |
| No call recording consent | Legal compliance violation | Announce recording at call start |
| Synchronous LLM in voice loop | 2-3s pause = terrible UX | Stream TTS while LLM generates |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Intent model, response model, temperature |
| `config/guardrails.json` | Escalation thresholds, timeout, max turns |
| `config/agents.json` | Voice selection, SSML templates, transfer rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement voice loop, dialog state, intent detection, TTS |
| `@reviewer` | Audit latency, escalation logic, compliance, UX quality |
| `@tuner` | Optimize response speed, voice quality, intent accuracy |

## Slash Commands
`/deploy` — Deploy voice agent | `/test` — Test dialog flows | `/review` — Audit compliance | `/evaluate` — Measure resolution + CSAT
