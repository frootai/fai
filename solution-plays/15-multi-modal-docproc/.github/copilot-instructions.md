---
description: "Multi-Modal Document Processing domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Multi-Modal Document Processing — Domain Knowledge

This workspace implements multi-modal document processing — combining OCR, vision (GPT-4o with images), table extraction, and layout analysis to process complex documents with mixed content (text + images + tables + charts).

## Multi-Modal Pipeline (What the Model Gets Wrong)

### Vision + OCR Combined Approach
```python
# WRONG — OCR only (loses images, charts, diagrams)
result = di_client.begin_analyze_document("prebuilt-layout", doc_bytes)

# CORRECT — combine Document Intelligence + GPT-4o vision
# Step 1: Document Intelligence for text + tables
di_result = di_client.begin_analyze_document("prebuilt-layout", doc_bytes)
text_content = extract_text_and_tables(di_result)

# Step 2: GPT-4o vision for images, charts, diagrams
import base64
for page in pdf_pages:
    image_b64 = base64.standard_b64encode(page_to_image(page)).decode()
    vision_result = client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this page content including any charts, diagrams, or images."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{image_b64}"}},
            ],
        }],
    )
    # Merge vision description with OCR text
```

### Document Type Classification
```python
# Classify document type BEFORE choosing extraction strategy
class DocClassification(BaseModel):
    doc_type: str  # invoice, contract, report, form, letter, manual
    has_tables: bool
    has_images: bool
    has_charts: bool
    page_count: int
    recommended_model: str  # prebuilt-invoice, prebuilt-layout, custom, vision

# Route to optimal extraction:
# - Invoices → prebuilt-invoice (structured fields)
# - Reports with charts → prebuilt-layout + GPT-4o vision
# - Scanned handwriting → prebuilt-read (OCR focused)
# - Custom forms → custom trained model
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| OCR only for complex docs | Loses images, charts, diagrams | Combine DI (text) + GPT-4o vision (images) |
| Processing entire PDF at once | Memory/token overflow on large docs | Process page-by-page, merge results |
| Ignoring document type | Wrong model → poor extraction | Classify first, route to best model |
| No table structure preservation | Tables flatten to text | Use DI layout + preserve row/column structure |
| Base64 images too large | Token/payload limit exceeded | Resize images to max 1024px before encoding |
| No confidence scoring | Accept bad extractions | Set field-level confidence threshold ≥0.8 |
| Single extraction pass | Miss content on complex layouts | Two-pass: DI for text/tables, vision for images |
| No PII detection on images | ID photos, signatures exposed | Run Content Safety on extracted image content |

## Processing Strategy by Document Type
| Document Type | Primary Model | Secondary | Output |
|--------------|--------------|-----------|--------|
| Invoice | prebuilt-invoice | — | Structured fields (vendor, amount, date) |
| Contract | prebuilt-layout + custom | GPT-4o for clauses | Extracted clauses + risk flags |
| Report | prebuilt-layout | GPT-4o vision for charts | Text + table + chart descriptions |
| Scanned form | prebuilt-read | custom model | OCR text + field extraction |
| Medical record | prebuilt-layout | GPT-4o (HIPAA) | Structured medical data (redacted) |

## Evaluation Targets
| Metric | Target |
|--------|--------|
| Text extraction accuracy | >= 97% |
| Table extraction accuracy | >= 92% |
| Image description quality | >= 85% (human eval) |
| Processing time per page | < 5 seconds |
| Confidence threshold | >= 0.8 per field |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | vision model, temperature, max_tokens for descriptions |
| `config/guardrails.json` | confidence thresholds, PII detection rules |
| `config/document-intelligence.json` | model IDs, page limits, image resize settings |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement multi-modal pipeline, vision integration, table extraction |
| `@reviewer` | Audit extraction accuracy, PII handling, confidence calibration |
| `@tuner` | Optimize model selection per doc type, image sizing, throughput |

## Slash Commands
`/deploy` — Deploy pipeline | `/test` — Test extraction | `/review` — Audit quality | `/evaluate` — Measure accuracy
