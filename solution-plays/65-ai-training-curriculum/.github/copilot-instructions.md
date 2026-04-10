---
description: "AI Training Curriculum domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Training Curriculum — Domain Knowledge

This workspace implements an AI-powered training curriculum — adaptive learning paths, skill assessment, content generation, knowledge gap analysis, and personalized recommendations for enterprise upskilling.

## Training AI Architecture (What the Model Gets Wrong)

### Adaptive Learning Path
```python
class LearnerProfile(BaseModel):
    current_skills: dict[str, float]    # {"python": 0.7, "azure": 0.3, "ml": 0.5}
    target_role: str                     # "ml-engineer"
    learning_style: str                  # visual, reading, hands-on
    available_hours_per_week: int        # Time budget
    completed_modules: list[str]         # Already finished

async def generate_learning_path(learner: LearnerProfile) -> LearningPath:
    # 1. Identify skill gaps
    target_skills = role_skill_matrix[learner.target_role]
    gaps = {skill: target - learner.current_skills.get(skill, 0) 
            for skill, target in target_skills.items() if learner.current_skills.get(skill, 0) < target}
    
    # 2. Prioritize by gap size + dependency order
    ordered = topological_sort(gaps, skill_dependencies)
    
    # 3. Select content matching learning style
    modules = []
    for skill in ordered:
        content = select_content(skill, learner.learning_style)
        modules.append(content)
    
    # 4. Estimate timeline
    total_hours = sum(m.estimated_hours for m in modules)
    weeks = total_hours / learner.available_hours_per_week
    
    return LearningPath(modules=modules, estimated_weeks=weeks, gaps=gaps)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Same path for everyone | Ignores existing skills, wastes time on known topics | Assess current skills first, fill gaps only |
| No dependency ordering | Advanced module before prerequisites | Topological sort on skill dependency graph |
| Single learning style | Visual learner gets text-heavy content | Match content format to learning preference |
| No progress tracking | Learner stuck without visibility | Track completion, quiz scores, time spent per module |
| LLM generates all content | Quality varies, no expert review | LLM drafts → subject matter expert reviews |
| No assessment validation | Quiz questions too easy or wrong | Validate assessments against learning objectives |
| Static curriculum | Industry skills change, content becomes stale | Quarterly review, trending skills from job postings |
| No hands-on labs | Theory without practice | Include interactive labs, sandboxes, projects |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Content generation model, assessment model |
| `config/guardrails.json` | Skill assessment thresholds, content quality standards |
| `config/agents.json` | Role-skill matrix, dependency graph, content sources |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement adaptive paths, content generation, assessments |
| `@reviewer` | Audit content accuracy, assessment quality, accessibility |
| `@tuner` | Optimize path effectiveness, completion rates, learner satisfaction |

## Slash Commands
`/deploy` — Deploy curriculum | `/test` — Test with sample learner | `/review` — Content audit | `/evaluate` — Measure learning outcomes
