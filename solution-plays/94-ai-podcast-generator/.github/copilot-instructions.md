---
description: "AI Podcast Generator domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Podcast Generator — Domain Knowledge

This workspace implements AI podcast generation — script writing from topics/articles, multi-voice TTS synthesis, conversational format (host + guest), music/sound effects integration, and publishing automation.

## Podcast Generation Architecture (What the Model Gets Wrong)

### Script → Audio Pipeline
```python
async def generate_podcast(topic: str, config: PodcastConfig) -> PodcastEpisode:
    # 1. Research + script generation
    research = await gather_sources(topic, max_sources=10)
    script = await generate_script(
        topic=topic, sources=research,
        format=config.format,  # "interview", "monologue", "panel", "debate"
        duration_minutes=config.target_duration,
        voices=config.voices,  # [{"name": "Host", "voice_id": "en-US-GuyNeural"}, {"name": "Expert", "voice_id": "en-US-JennyNeural"}]
    )
    
    # 2. Per-segment TTS with SSML for natural conversation
    audio_segments = []
    for segment in script.segments:
        ssml = generate_ssml(segment.text, segment.speaker, segment.emotion)
        audio = await tts.synthesize(ssml, voice=segment.speaker.voice_id)
        audio_segments.append(audio)
    
    # 3. Post-processing: music, transitions, normalization
    final_audio = await post_process(audio_segments, 
        intro_music=config.intro_music, outro_music=config.outro_music,
        transition_sound=config.transition, normalize_loudness=-16)  # LUFS standard
    
    return PodcastEpisode(audio=final_audio, script=script, duration=final_audio.duration)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Single voice for all speakers | Sounds like one person talking to themselves | Different voice per speaker (Neural Voice variety) |
| No SSML prosody control | Robotic, flat delivery | SSML: rate, pitch, emphasis, pauses for natural speech |
| Script reads like an article | Not conversational, boring | Write as dialogue with questions, reactions, humor |
| No source attribution | Content from nowhere = no credibility | Cite sources in script: "According to [Source]..." |
| No audio normalization | Volume varies wildly between segments | Normalize to -16 LUFS (podcast standard) |
| Full episode in one TTS call | Token limit, no per-speaker control | Generate per-segment, assemble in post-processing |
| No content safety on script | Inappropriate content in generated scripts | Content Safety check on script before TTS |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Script model (creative, temp=0.7), research model |
| `config/guardrails.json` | Content safety, duration limits, source requirements |
| `config/agents.json` | Voice assignments, format templates, publishing config |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement script generation, TTS pipeline, post-processing |
| `@reviewer` | Audit content quality, source accuracy, audio quality |
| `@tuner` | Optimize script engagement, voice quality, production flow |

## Slash Commands
`/deploy` — Deploy generator | `/test` — Generate sample episode | `/review` — Audit quality | `/evaluate` — Measure listener engagement
