---
description: "Healthcare Clinical AI domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Healthcare Clinical AI — Domain Knowledge

This workspace implements AI for healthcare — clinical decision support, medical coding (ICD-10/CPT), drug interaction checking, patient risk scoring, and clinical NLP, all under strict HIPAA compliance.

## Healthcare AI Architecture (What the Model Gets Wrong)

### HIPAA-Compliant AI Pipeline
```python
# WRONG — send PHI to standard OpenAI endpoint
response = openai_client.chat.completions.create(model="gpt-4o", messages=[{"role": "user", "content": patient_record}])

# CORRECT — Azure OpenAI with HIPAA BAA, data residency, no logging
# 1. Azure OpenAI in HIPAA-eligible region with BAA signed
# 2. Disable Azure logging for PHI workloads
# 3. No PHI in system prompts (only in user messages with consent)
response = azure_openai_client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a clinical decision support assistant. Do not store or repeat patient identifiers."},
        {"role": "user", "content": deidentified_query},  # De-identified before sending
    ],
)
```

### De-Identification Before AI Processing
```python
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

# Detect and mask PHI entities
results = analyzer.analyze(text=clinical_note, entities=["PERSON", "DATE_TIME", "PHONE_NUMBER", "US_SSN", "MEDICAL_LICENSE"], language="en")
deidentified = anonymizer.anonymize(text=clinical_note, analyzer_results=results)
# "John Smith, DOB 01/15/1980" → "<PERSON>, DOB <DATE_TIME>"
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| PHI in system prompts | Logged, cached, potentially exposed | PHI only in user messages, de-identify first |
| No BAA with Azure | HIPAA violation — no legal coverage | Sign BAA before processing any PHI |
| Standard OpenAI (not Azure) | No HIPAA compliance, data may leave region | Azure OpenAI with HIPAA-eligible deployment |
| AI making clinical decisions | Liability, regulatory risk | Decision SUPPORT only — human physician decides |
| No audit trail | Can't prove compliance during audit | Log every access, query (de-identified), response |
| Using real patient data for testing | HIPAA violation | Synthetic data for dev/test, real data only in prod with consent |
| No de-identification | PHI flows through entire pipeline | Presidio or Azure Health De-identification before AI |
| Drug interaction without evidence | LLM hallucinate interactions | Ground in FDA drug database, not LLM knowledge |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model (HIPAA-eligible deployment), temperature=0 for clinical |
| `config/guardrails.json` | PHI entity types, de-identification rules, audit retention |
| `config/agents.json` | Clinical workflow rules, consent requirements, evidence sources |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement clinical NLP, de-identification, decision support |
| `@reviewer` | Audit HIPAA compliance, PHI handling, clinical accuracy |
| `@tuner` | Optimize de-identification accuracy, response quality, latency |

## Slash Commands
`/deploy` — Deploy clinical AI | `/test` — Test with synthetic data | `/review` — HIPAA audit | `/evaluate` — Measure clinical accuracy
