---
description: "Continual Learning Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Continual Learning Agent — Domain Knowledge

This workspace implements a continual learning agent — persistent memory across sessions, knowledge distillation, reflection loops, skill acquisition tracking, and adaptive behavior based on accumulated experience.

## Continual Learning Architecture (What the Model Gets Wrong)

### Memory-Augmented Agent
```python
class ContinualAgent:
    def __init__(self):
        self.episodic_memory = VectorStore()    # Specific experiences (what happened)
        self.semantic_memory = KnowledgeGraph() # General knowledge (what I've learned)
        self.procedural_memory = SkillStore()   # How to do things (learned procedures)
    
    async def process(self, task: Task) -> Response:
        # 1. Recall relevant past experiences
        relevant_episodes = await self.episodic_memory.search(task.description, top_k=5)
        relevant_knowledge = await self.semantic_memory.query(task.entities)
        relevant_skills = await self.procedural_memory.match(task.type)
        
        # 2. Reason with memory context
        response = await self.reason(task, episodes=relevant_episodes, 
                                      knowledge=relevant_knowledge, skills=relevant_skills)
        
        # 3. Reflect and learn
        outcome = await self.evaluate_response(response, task)
        await self.learn_from_experience(task, response, outcome)
        
        return response
    
    async def learn_from_experience(self, task, response, outcome):
        # Store episode
        await self.episodic_memory.store(Episode(task=task, response=response, outcome=outcome))
        
        # Distill knowledge (if pattern detected across 3+ similar episodes)
        patterns = await self.detect_patterns(task.type)
        if patterns:
            await self.semantic_memory.update(patterns)
        
        # Update skill if procedure improved
        if outcome.success and outcome.efficiency > self.procedural_memory.get(task.type).avg_efficiency:
            await self.procedural_memory.update(task.type, response.procedure)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| No memory between sessions | Agent starts fresh every time | Persistent vector store for episodic memory |
| Store everything | Memory bloat, irrelevant recall | Relevance filtering + TTL + importance scoring |
| No reflection loop | Agent doesn't learn from mistakes | After each task: evaluate → reflect → update knowledge |
| Episodic only (no distillation) | Can't generalize from specific experiences | Distill patterns from episodes → semantic knowledge |
| No forgetting mechanism | Outdated knowledge persists | Decay old memories, overwrite with newer patterns |
| Memory without retrieval quality | Wrong memories recalled, bad decisions | Evaluate retrieval relevance, prune low-quality matches |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Reasoning model, reflection model, temperature |
| `config/guardrails.json` | Memory retention TTL, distillation threshold, max memory size |
| `config/agents.json` | Memory stores, reflection frequency, skill categories |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement memory stores, reflection loops, skill tracking |
| `@reviewer` | Audit memory quality, learning effectiveness, privacy |
| `@tuner` | Optimize retrieval relevance, distillation frequency, memory size |

## Slash Commands
`/deploy` — Deploy agent | `/test` — Test learning loop | `/review` — Audit memory | `/evaluate` — Measure learning curve
