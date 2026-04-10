---
description: "Construction Safety AI domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Construction Safety AI — Domain Knowledge

This workspace implements AI for construction safety — PPE detection from video/images, hazard zone monitoring, incident prediction, safety compliance reporting, and real-time worker alerts.

## Construction Safety Architecture (What the Model Gets Wrong)

### PPE Detection Pipeline
```python
async def monitor_safety(camera_feed: VideoStream) -> list[SafetyAlert]:
    alerts = []
    async for frame in camera_feed.frames(fps=2):  # 2 frames/sec for efficiency
        # 1. Detect workers in frame
        workers = await person_detector.detect(frame)
        
        # 2. Check PPE compliance per worker
        for worker in workers:
            ppe = await ppe_detector.classify(worker.crop, required=["hard_hat", "vest", "boots", "gloves"])
            if ppe.missing:
                alerts.append(SafetyAlert(type="ppe_violation", missing=ppe.missing, location=worker.zone, confidence=ppe.confidence))
        
        # 3. Hazard zone intrusion detection
        for zone in hazard_zones:
            intruders = [w for w in workers if zone.contains(w.position)]
            if intruders:
                alerts.append(SafetyAlert(type="zone_intrusion", zone=zone.name, workers=len(intruders)))
    
    return alerts
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Process every frame | Wasteful, most frames identical | Sample at 1-2 FPS, motion-triggered for higher rate |
| No zone configuration | Can't distinguish safe vs hazard areas | Define hazard zones with geo-fencing per site |
| Alert on every detection | Alert fatigue from false positives | Confidence threshold >0.8, aggregate alerts per worker |
| No night/low-light handling | Cameras useless after dark | IR cameras or enhanced low-light models |
| Single camera per site | Blind spots miss violations | Multi-camera coverage with mapped zones |
| LLM for real-time detection | Too slow for safety-critical | YOLO/RT-DETR for detection, LLM for report generation |
| No incident trend analysis | React to incidents, don't prevent | Track patterns → predict high-risk periods |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for incident report generation |
| `config/guardrails.json` | PPE requirements per zone, confidence thresholds |
| `config/agents.json` | Camera locations, hazard zones, alert routing |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement PPE detection, zone monitoring, alerting |
| `@reviewer` | Audit detection accuracy, alert effectiveness, compliance |
| `@tuner` | Optimize detection models, reduce false positives, alert rules |

## Slash Commands
`/deploy` — Deploy safety AI | `/test` — Test with sample video | `/review` — Compliance audit | `/evaluate` — Measure detection rate
