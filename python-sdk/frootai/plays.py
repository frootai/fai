"""FrootAI Solution Plays — 20 pre-tuned AI architecture blueprints.

Each play is a validated combination of Azure AI services, configuration
parameters, and architecture patterns. Plays map to FROOT layers.
"""

from dataclasses import dataclass, field
from typing import Optional

# Structured play data — each play is a tested architecture pattern
_PLAYS_DATA = [
    {"id": "01", "name": "Enterprise RAG Q&A", "description": "Production RAG pipeline with AI Search + Azure OpenAI. Hybrid retrieval, semantic ranking, citation grounding.", "complexity": "Medium", "status": "Ready", "layer": "R", "infra": ["AI Search", "Azure OpenAI", "Container Apps", "Log Analytics"], "tuning": ["temperature", "top_k", "chunk_size", "overlap"], "modules": ["R1", "R2"]},
    {"id": "02", "name": "AI Landing Zone", "description": "Foundation Azure infrastructure for AI workloads. VNet isolation, private endpoints, managed identity, RBAC, diagnostic settings.", "complexity": "Foundation", "status": "Ready", "layer": "F", "infra": ["VNet", "Private Endpoints", "RBAC", "Key Vault", "Log Analytics"], "tuning": ["network_config", "sku_tier", "gpu_quota"], "modules": ["F1", "F2"]},
    {"id": "03", "name": "Deterministic Agent", "description": "Reliable AI agent with temperature=0, JSON output schema, guardrails, and citation enforcement.", "complexity": "Medium", "status": "Ready", "layer": "O_ORCH", "infra": ["Container Apps", "Azure OpenAI", "Content Safety"], "tuning": ["temperature", "response_format", "max_tokens", "guardrail_config"], "modules": ["O1", "O2", "R3"]},
    {"id": "04", "name": "Call Center Voice AI", "description": "Voice-enabled AI customer service with real-time speech-to-text, intent routing, and voice synthesis.", "complexity": "High", "status": "Ready", "layer": "O_ORCH", "infra": ["Communication Services", "AI Speech", "Azure OpenAI"], "tuning": ["speech_config", "voice_persona", "intent_routing"], "modules": ["O1"]},
    {"id": "05", "name": "IT Ticket Resolution", "description": "Auto-classify, route, and resolve IT tickets using LLM analysis and knowledge base lookup.", "complexity": "Medium", "status": "Ready", "layer": "O_OPS", "infra": ["Azure OpenAI", "Container Apps", "Logic Apps"], "tuning": ["classification_prompts", "routing_rules", "confidence_threshold"], "modules": ["O4", "O5"]},
    {"id": "06", "name": "Document Intelligence", "description": "Extract structured data from documents using Azure Document Intelligence + GPT-4o for complex reasoning.", "complexity": "Medium", "status": "Ready", "layer": "R", "infra": ["Document Intelligence", "Azure OpenAI", "Blob Storage"], "tuning": ["extraction_prompts", "field_schemas", "confidence_threshold"], "modules": ["R1"]},
    {"id": "07", "name": "Multi-Agent Service", "description": "Supervisor agent orchestrating specialist sub-agents with handoff protocols and shared state.", "complexity": "High", "status": "Ready", "layer": "O_ORCH", "infra": ["Container Apps", "Azure OpenAI", "Cosmos DB", "Dapr"], "tuning": ["supervisor_routing", "handoff_rules", "agent_capabilities"], "modules": ["O1", "O2", "O3"]},
    {"id": "08", "name": "Copilot Studio Bot", "description": "Low-code enterprise bot built with Copilot Studio, Dataverse knowledge, and Teams integration.", "complexity": "Low", "status": "Ready", "layer": "O_ORCH", "infra": ["Copilot Studio", "Dataverse", "Teams"], "tuning": ["topic_design", "knowledge_sources", "auth_config"], "modules": ["O1"]},
    {"id": "09", "name": "AI Search Portal", "description": "Enterprise search portal with semantic ranking, hybrid retrieval, and faceted navigation.", "complexity": "Medium", "status": "Ready", "layer": "R", "infra": ["AI Search", "App Service", "Log Analytics"], "tuning": ["hybrid_weights", "scoring_profiles", "semantic_config"], "modules": ["R1", "R2"]},
    {"id": "10", "name": "Content Moderation", "description": "AI Content Safety pipeline with configurable severity thresholds and custom blocklists.", "complexity": "Low", "status": "Ready", "layer": "O_OPS", "infra": ["Content Safety", "API Management"], "tuning": ["severity_levels", "blocklists", "custom_categories"], "modules": ["O5", "O6"]},
    {"id": "11", "name": "Landing Zone Advanced", "description": "Multi-region AI infrastructure with Azure Policy, hub-spoke networking, and governance automation.", "complexity": "High", "status": "Ready", "layer": "F", "infra": ["Multi-region VNet", "Azure Policy", "Management Groups"], "tuning": ["governance_policies", "advanced_rbac", "region_config"], "modules": ["F1", "F2"]},
    {"id": "12", "name": "Model Serving AKS", "description": "GPU model inference on AKS with autoscaling, health probes, and model versioning.", "complexity": "High", "status": "Ready", "layer": "T", "infra": ["AKS", "GPU Nodes", "Container Registry"], "tuning": ["model_config", "scaling_rules", "gpu_sku"], "modules": ["T1", "T2"]},
    {"id": "13", "name": "Fine-Tuning Workflow", "description": "End-to-end model fine-tuning pipeline: dataset prep, training, evaluation, deployment.", "complexity": "High", "status": "Ready", "layer": "T", "infra": ["Azure OpenAI Fine-tuning", "Blob Storage", "ML Workspace"], "tuning": ["dataset_prep", "hyperparameters", "eval_metrics"], "modules": ["T1"]},
    {"id": "14", "name": "AI Gateway", "description": "API Management gateway for Azure OpenAI with rate limiting, token budgets, and cost tracking.", "complexity": "Medium", "status": "Ready", "layer": "O_OPS", "infra": ["API Management", "Azure OpenAI", "Log Analytics"], "tuning": ["rate_limits", "token_budgets", "routing_rules"], "modules": ["O4", "O5"]},
    {"id": "15", "name": "Multi-Modal DocProc", "description": "Vision + document processing combining Document Intelligence with GPT-4o multimodal analysis.", "complexity": "High", "status": "Ready", "layer": "R", "infra": ["Document Intelligence", "Azure OpenAI GPT-4o", "Blob Storage"], "tuning": ["extraction_config", "confidence_thresholds", "vision_prompts"], "modules": ["R1"]},
    {"id": "16", "name": "Copilot Teams Extension", "description": "Teams-embedded AI assistant with adaptive cards, SSO, and plugin architecture.", "complexity": "Medium", "status": "Ready", "layer": "O_ORCH", "infra": ["Teams", "Copilot Studio", "Bot Framework"], "tuning": ["adaptive_cards", "auth_config", "plugin_manifest"], "modules": ["O1", "O3"]},
    {"id": "17", "name": "AI Observability", "description": "Full-stack monitoring for AI workloads: custom metrics, distributed tracing, alert rules, cost dashboards.", "complexity": "Medium", "status": "Ready", "layer": "O_OPS", "infra": ["Application Insights", "Log Analytics", "Azure Monitor"], "tuning": ["custom_metrics", "alert_rules", "dashboard_config"], "modules": ["O4", "O6"]},
    {"id": "18", "name": "Prompt Management", "description": "Version-controlled prompt library with A/B testing, rollback, and environment promotion.", "complexity": "Low", "status": "Ready", "layer": "T", "infra": ["Blob Storage", "Container Apps", "Cosmos DB"], "tuning": ["prompt_templates", "ab_config", "version_strategy"], "modules": ["T2", "T3"]},
    {"id": "19", "name": "Edge AI Phi-4", "description": "On-device AI inference using quantized Phi-4 models with ONNX Runtime.", "complexity": "High", "status": "Ready", "layer": "T", "infra": ["ONNX Runtime", "Phi-4", "Windows ML"], "tuning": ["quantization", "edge_config", "model_optimization"], "modules": ["T1", "T3"]},
    {"id": "20", "name": "Anomaly Detection", "description": "Real-time anomaly detection pipeline with streaming data, statistical models, and AI-powered alerting.", "complexity": "High", "status": "Ready", "layer": "O_OPS", "infra": ["Event Hub", "Stream Analytics", "Azure OpenAI"], "tuning": ["thresholds", "detection_windows", "alert_config"], "modules": ["O4", "O5"]},
]


@dataclass
class SolutionPlay:
    """A FrootAI solution play — a validated Azure AI architecture pattern."""
    id: str
    name: str
    description: str
    complexity: str
    status: str
    layer: str
    infra: list[str] = field(default_factory=list)
    tuning: list[str] = field(default_factory=list)
    modules: list[str] = field(default_factory=list)

    @staticmethod
    def all() -> list["SolutionPlay"]:
        """Get all 20 solution plays."""
        return [SolutionPlay(**p) for p in _PLAYS_DATA]

    @staticmethod
    def get(play_id: str) -> Optional["SolutionPlay"]:
        """Get a play by ID (e.g. '01') or name substring (e.g. 'rag')."""
        for p in _PLAYS_DATA:
            if p["id"] == play_id or play_id.lower() in p["name"].lower():
                return SolutionPlay(**p)
        return None

    @staticmethod
    def by_layer(layer: str) -> list["SolutionPlay"]:
        """Get all plays in a FROOT layer (F, R, O_ORCH, O_OPS, T)."""
        return [SolutionPlay(**p) for p in _PLAYS_DATA if p["layer"] == layer]

    @staticmethod
    def by_status(status: str) -> list["SolutionPlay"]:
        """Get plays by status ('Ready' or 'Skeleton')."""
        return [SolutionPlay(**p) for p in _PLAYS_DATA if p["status"] == status]

    @staticmethod
    def ready() -> list["SolutionPlay"]:
        """Get all production-ready plays."""
        return SolutionPlay.by_status("Ready")
