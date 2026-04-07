"""FrootAI MCP Server — Production Python Implementation.

All tools query the bundled 682KB knowledge.json with real data.
Compatible with Claude Desktop, VS Code Copilot, Cursor, any MCP client.
"""
import json, sys, re
from pathlib import Path
from typing import Any, Optional

PLAYS = [
    {"id":"01","name":"Enterprise RAG Q&A","desc":"Production RAG — AI Search + OpenAI + Container Apps","cx":"Medium","infra":"AI Search · Azure OpenAI · Container Apps · Blob","tune":"temperature · top-k · chunk size · reranking"},
    {"id":"02","name":"AI Landing Zone","desc":"Foundation Azure infra — VNet, private endpoints, RBAC, GPU quotas","cx":"Foundation","infra":"VNet · Private Endpoints · RBAC · Managed Identity · Key Vault","tune":"Network config · SKUs · GPU quota · region"},
    {"id":"03","name":"Deterministic Agent","desc":"Reliable agent — temp=0, structured JSON, guardrails","cx":"Medium","infra":"Container Apps · Azure OpenAI · Content Safety","tune":"temperature=0 · JSON schema · seed · citations"},
    {"id":"04","name":"Call Center Voice AI","desc":"Voice customer service — Communication Services + AI Speech","cx":"High","infra":"Communication Services · AI Speech · Azure OpenAI","tune":"Speech config · grounding prompts"},
    {"id":"05","name":"IT Ticket Resolution","desc":"Auto-classify, route, resolve IT tickets","cx":"Medium","infra":"Logic Apps · Azure OpenAI · ServiceNow MCP","tune":"Classification prompts · routing rules"},
    {"id":"06","name":"Document Intelligence","desc":"Extract, classify, structure document data","cx":"Medium","infra":"Blob · Document Intelligence · Azure OpenAI","tune":"Extraction prompts · confidence thresholds"},
    {"id":"07","name":"Multi-Agent Service","desc":"Supervisor + specialist agents","cx":"High","infra":"Container Apps · Azure OpenAI · Cosmos DB · Dapr","tune":"Supervisor routing · handoff rules"},
    {"id":"08","name":"Copilot Studio Bot","desc":"Low-code enterprise bot","cx":"Low","infra":"Copilot Studio · Dataverse · SharePoint","tune":"Topic design · knowledge sources"},
    {"id":"09","name":"AI Search Portal","desc":"Enterprise search with semantic ranking","cx":"Medium","infra":"AI Search · App Service · Azure OpenAI","tune":"Hybrid weights · scoring profiles"},
    {"id":"10","name":"Content Moderation","desc":"AI Content Safety + filtering","cx":"Low","infra":"Content Safety · API Management · Functions","tune":"Severity levels · blocklists"},
    {"id":"11","name":"Landing Zone Advanced","desc":"Multi-region, policy-driven AI landing zone","cx":"High","infra":"Multi-region VNet · Azure Policy · RBAC","tune":"Governance · advanced RBAC"},
    {"id":"12","name":"Model Serving AKS","desc":"GPU model serving on Kubernetes","cx":"High","infra":"AKS · GPU Nodes · Container Registry","tune":"Model config · autoscaling"},
    {"id":"13","name":"Fine-Tuning Workflow","desc":"Custom model fine-tuning pipeline","cx":"High","infra":"OpenAI Fine-tuning · Blob Storage","tune":"Dataset prep · hyperparameters"},
    {"id":"14","name":"AI Gateway","desc":"API management + cost control for AI","cx":"Medium","infra":"API Management · Azure OpenAI · Functions","tune":"Rate limits · token budgets"},
    {"id":"15","name":"Multi-Modal DocProc","desc":"Vision + document processing","cx":"High","infra":"Document Intelligence · GPT-4o · Blob","tune":"Extraction config · confidence"},
    {"id":"16","name":"Copilot Teams Extension","desc":"Teams bot with AI capabilities","cx":"Medium","infra":"Teams · Bot Framework · Azure OpenAI","tune":"Adaptive cards · auth config"},
    {"id":"17","name":"AI Observability","desc":"Monitoring + tracing for AI workloads","cx":"Medium","infra":"App Insights · Log Analytics · Azure Monitor","tune":"Custom metrics · alert rules"},
    {"id":"18","name":"Prompt Management","desc":"Version-controlled prompt library","cx":"Low","infra":"Blob Storage · Container Apps · Cosmos DB","tune":"Prompt templates · A/B config"},
    {"id":"19","name":"Edge AI Phi-4","desc":"On-device AI with Phi models","cx":"High","infra":"ONNX Runtime · Phi-4-mini · Edge devices","tune":"Quantization · edge config"},
    {"id":"20","name":"Anomaly Detection","desc":"Real-time anomaly detection in streams","cx":"High","infra":"Event Hub · Stream Analytics · Azure OpenAI","tune":"Threshold config · detection windows"},
    {"id":"21","name":"Agentic RAG","desc":"Autonomous multi-step RAG with iterative retrieval","cx":"High","infra":"OpenAI · AI Search · Container Apps · Key Vault","tune":"retrieval strategy · source ranking · iteration depth"},
    {"id":"22","name":"Multi-Agent Swarm","desc":"Swarm-based multi-agent with dynamic delegation","cx":"Very High","infra":"OpenAI · Container Apps · Service Bus · Cosmos DB","tune":"team topology · delegation rules · max turns"},
    {"id":"23","name":"Browser Automation","desc":"AI-driven browser automation with vision models","cx":"High","infra":"OpenAI Vision · Container Apps · Playwright","tune":"domain allowlist · vision prompts · action timeout"},
    {"id":"24","name":"AI Code Review","desc":"Automated code review with LLM + CodeQL","cx":"Medium","infra":"OpenAI · GitHub Actions · CodeQL","tune":"severity thresholds · review depth · OWASP rules"},
    {"id":"25","name":"Conversation Memory","desc":"Tiered conversation memory across sessions","cx":"High","infra":"OpenAI · Cosmos DB · AI Search · Redis","tune":"memory tier TTLs · recall strategy · embedding config"},
    {"id":"26","name":"Semantic Search Engine","desc":"Enterprise semantic search with hybrid retrieval","cx":"Medium","infra":"AI Search · OpenAI · Blob Storage","tune":"hybrid weights · reranker · personalization"},
    {"id":"27","name":"AI Data Pipeline","desc":"LLM-powered data classification and enrichment","cx":"High","infra":"OpenAI mini · Data Factory · Cosmos DB · Event Hubs","tune":"classification prompts · PII rules · batch size"},
    {"id":"28","name":"Knowledge Graph RAG","desc":"Graph-enhanced RAG with knowledge graph traversal","cx":"High","infra":"OpenAI · Cosmos DB Gremlin · AI Search","tune":"graph depth · entity types · fusion ratio"},
    {"id":"29","name":"MCP Gateway","desc":"Centralized MCP tool gateway with API management","cx":"Medium","infra":"APIM · Container Apps · Monitor","tune":"rate limits · auth policies · tool registry"},
    {"id":"30","name":"AI Security Hardening","desc":"AI security with content safety and red teaming","cx":"High","infra":"Content Safety · OpenAI · Container Apps","tune":"severity thresholds · blocklists · red team scenarios"},
    {"id":"31","name":"Low-Code AI Builder","desc":"Visual AI pipeline builder with one-click deploy","cx":"Medium","infra":"OpenAI · Container Apps · Cosmos DB · Static Web Apps","tune":"pipeline templates · deployment targets"},
    {"id":"32","name":"AI-Powered Testing","desc":"AI test generation and mutation testing","cx":"Medium","infra":"OpenAI · GitHub Actions · Container Apps","tune":"coverage targets · mutation rules · framework configs"},
    {"id":"33","name":"Voice AI Agent","desc":"Conversational voice agent with real-time speech","cx":"High","infra":"AI Speech · OpenAI · Communication Services","tune":"voice models · intent thresholds · fallback chains"},
    {"id":"34","name":"Edge AI Deployment","desc":"Edge-optimized AI with quantization and cloud sync","cx":"High","infra":"IoT Hub · ONNX Runtime · Container Instances","tune":"quantization level · sync schedule · memory budget"},
    {"id":"35","name":"AI Compliance Engine","desc":"Automated compliance checking and audit trails","cx":"High","infra":"OpenAI · Azure Policy · Key Vault · Cosmos DB","tune":"compliance frameworks · audit schedules · risk thresholds"},
    {"id":"36","name":"Multimodal Agent","desc":"Agent handling text, image, and audio inputs","cx":"Medium","infra":"OpenAI Vision · AI Vision · Blob Storage","tune":"vision prompts · image resolution · routing"},
    {"id":"37","name":"AI-Powered DevOps","desc":"AIOps with incident detection and auto-remediation","cx":"Medium","infra":"OpenAI · Monitor · DevOps · GitHub Actions","tune":"severity rules · runbook config · scaling thresholds"},
    {"id":"38","name":"Document Understanding v2","desc":"Advanced document processing with custom schemas","cx":"High","infra":"Document Intelligence · OpenAI · Cosmos DB","tune":"extraction schemas · confidence thresholds · entity types"},
    {"id":"39","name":"AI Meeting Assistant","desc":"Meeting intelligence with transcription and actions","cx":"Medium","infra":"AI Speech · OpenAI · Graph · Container Apps","tune":"transcription config · action item rules · scheduling"},
    {"id":"40","name":"Copilot Studio Advanced","desc":"Advanced Copilot Studio with custom agents","cx":"High","infra":"Copilot Studio · OpenAI · Dataverse · Graph","tune":"agent config · permissions · scoping · multi-turn rules"},
    {"id":"41","name":"AI Red Teaming","desc":"Systematic AI red teaming and safety evaluation","cx":"High","infra":"AI Foundry · Content Safety · OpenAI","tune":"attack diversity · severity thresholds · jailbreak detection"},
    {"id":"42","name":"Computer Use Agent","desc":"Vision-based desktop automation agent","cx":"Very High","infra":"OpenAI Vision · Container Apps · Blob Storage","tune":"vision confidence · action retry · screenshot resolution"},
    {"id":"43","name":"AI Video Generation","desc":"AI video generation with safety and quality controls","cx":"Very High","infra":"OpenAI · Blob Storage · Content Safety · Service Bus","tune":"video quality · frame rate · content safety"},
    {"id":"44","name":"Foundry Local On-Device","desc":"On-device AI with Foundry Local and cloud escalation","cx":"High","infra":"OpenAI · IoT Hub · Monitor","tune":"local model threshold · cloud escalation · sync interval"},
    {"id":"45","name":"Real-Time Event AI","desc":"Real-time event processing with AI anomaly detection","cx":"Very High","infra":"Event Hubs · Functions · OpenAI · Cosmos DB · SignalR","tune":"latency SLA · window size · anomaly threshold"},
    {"id":"46","name":"Healthcare Clinical AI","desc":"Clinical decision support with human-in-the-loop","cx":"Very High","infra":"OpenAI · Health Data Services · AI Search · Content Safety","tune":"clinical confidence · PII redaction · human approval"},
    {"id":"47","name":"Synthetic Data Factory","desc":"Privacy-preserving synthetic data generation","cx":"High","infra":"OpenAI · ML · Blob Storage","tune":"privacy epsilon · statistical fidelity · bias threshold"},
    {"id":"48","name":"AI Model Governance","desc":"Model lifecycle governance with drift detection","cx":"High","infra":"ML · AI Foundry · DevOps · Cosmos DB · Policy","tune":"approval gates · drift detection · evaluation frequency"},
    {"id":"49","name":"Creative AI Studio","desc":"Creative content generation with brand voice","cx":"High","infra":"OpenAI · Blob Storage · Content Safety · Functions · CDN","tune":"brand voice · content safety · output quality"},
    {"id":"50","name":"Financial Risk Intelligence","desc":"Financial risk analysis with real-time monitoring","cx":"Very High","infra":"OpenAI · AI Search · Cosmos DB · Event Hubs","tune":"risk confidence · regulatory compliance · fraud sensitivity"},
    {"id":"51","name":"Autonomous Coding Agent","desc":"Self-directed coding agent with test validation","cx":"Very High","infra":"OpenAI · GitHub Actions · Container Apps","tune":"code gen temp · max iterations · test coverage"},
    {"id":"52","name":"AI API Gateway v2","desc":"Advanced AI gateway with semantic caching","cx":"High","infra":"APIM · OpenAI · Redis · Monitor","tune":"cache similarity · routing score · token budget"},
    {"id":"53","name":"Legal Document AI","desc":"Legal document analysis with risk assessment","cx":"Very High","infra":"OpenAI · AI Search · Blob Storage · Cosmos DB","tune":"clause confidence · risk threshold · privilege sensitivity"},
    {"id":"54","name":"AI Customer Support v2","desc":"Advanced AI support with sentiment and escalation","cx":"High","infra":"OpenAI · AI Search · Communication Services · Cosmos DB","tune":"sentiment threshold · auto-resolution · escalation priority"},
    {"id":"55","name":"Supply Chain AI","desc":"Supply chain optimization with demand forecasting","cx":"Very High","infra":"OpenAI · Cosmos DB · Event Hubs · ML","tune":"forecast horizon · safety stock · supplier risk"},
    {"id":"56","name":"Semantic Code Search","desc":"Codebase semantic search with embedding retrieval","cx":"Medium","infra":"OpenAI · AI Search · Blob Storage","tune":"chunk size · relevance threshold · refresh interval"},
    {"id":"57","name":"AI Translation Engine","desc":"Neural translation with glossary and cultural adaptation","cx":"High","infra":"OpenAI · AI Translator · Cosmos DB · CDN","tune":"quality threshold · glossary priority · cultural adaptation"},
    {"id":"58","name":"Digital Twin Agent","desc":"Digital twin with IoT and predictive simulation","cx":"Very High","infra":"IoT Hub · Digital Twins · OpenAI · Functions","tune":"anomaly sensitivity · prediction horizon · simulation fidelity"},
    {"id":"59","name":"AI Recruiter Agent","desc":"AI recruitment with matching and bias detection","cx":"High","infra":"OpenAI · AI Search · Cosmos DB · Graph","tune":"match threshold · bias sensitivity · skills weight"},
    {"id":"60","name":"Responsible AI Dashboard","desc":"Responsible AI monitoring with fairness metrics","cx":"High","infra":"OpenAI · ML · Monitor · Cosmos DB · Static Web Apps","tune":"fairness threshold · bias granularity · report frequency"},
    {"id":"61","name":"Content Moderation v2","desc":"Advanced content moderation with severity routing","cx":"High","infra":"Content Safety · OpenAI · Cosmos DB · Service Bus","tune":"safety threshold · severity routing · category weights"},
    {"id":"62","name":"Federated Learning Pipeline","desc":"Privacy-preserving federated learning","cx":"Very High","infra":"ML · Confidential Computing · Blob Storage","tune":"privacy epsilon · aggregation rounds · convergence threshold"},
    {"id":"63","name":"Fraud Detection Agent","desc":"Real-time fraud detection with streaming analysis","cx":"High","infra":"OpenAI · Event Hubs · Stream Analytics · Cosmos DB","tune":"risk score · velocity window · anomaly sensitivity"},
    {"id":"64","name":"AI Sales Assistant","desc":"AI sales copilot with lead scoring and outreach","cx":"Medium","infra":"OpenAI · Cosmos DB · Graph · AI Search","tune":"lead score · persona temp · email tone · forecast confidence"},
    {"id":"65","name":"AI Training Curriculum","desc":"Adaptive AI training with difficulty scaling","cx":"Medium","infra":"OpenAI · Cosmos DB · Static Web Apps","tune":"difficulty scaling · assessment threshold · feedback detail"},
    {"id":"66","name":"AI Infrastructure Optimizer","desc":"AI-driven infra optimization and cost analysis","cx":"High","infra":"OpenAI · Monitor · Advisor · Cost Management","tune":"savings threshold · utilization floor · scaling aggressiveness"},
    {"id":"67","name":"AI Knowledge Management","desc":"Enterprise knowledge management with contextual retrieval","cx":"High","infra":"OpenAI · AI Search · Cosmos DB · Graph","tune":"freshness decay · chunk overlap · expert threshold"},
    {"id":"68","name":"Predictive Maintenance AI","desc":"Predictive maintenance with IoT sensor analysis","cx":"High","infra":"IoT Hub · OpenAI · ML · Stream Analytics · Cosmos DB","tune":"failure probability · sensor window · RUL confidence"},
    {"id":"69","name":"Carbon Footprint Tracker","desc":"Real-time carbon accounting across cloud and supply chain","cx":"High","infra":"Azure Monitor · OpenAI · Cosmos DB · Event Hubs","tune":"emission factors · scope boundaries · reporting framework"},
    {"id":"70","name":"ESG Compliance Agent","desc":"ESG reporting with GRI, SASB, TCFD, CSRD compliance","cx":"High","infra":"OpenAI · Document Intelligence · Cosmos DB · AI Search","tune":"regulatory frameworks · materiality matrix · disclosure rules"},
    {"id":"71","name":"Smart Energy Grid AI","desc":"Energy demand prediction and grid balancing via digital twin","cx":"Very High","infra":"IoT Hub · OpenAI · Stream Analytics · Digital Twins","tune":"demand horizon · renewable mix · battery schedule"},
    {"id":"72","name":"Climate Risk Assessor","desc":"Climate scenario modeling for financial risk assessment","cx":"High","infra":"OpenAI · ML · Cosmos DB · AI Search","tune":"climate scenarios · time horizons · risk tolerance"},
    {"id":"73","name":"Waste & Recycling Optimizer","desc":"Waste classification, route optimization, contamination detection","cx":"Medium","infra":"AI Vision · OpenAI · IoT Hub · Container Apps","tune":"material categories · classification confidence · vehicle capacity"},{"id":"74","name":"AI Tutoring Agent","desc":"1-on-1 personalized tutoring with Socratic method and adaptive difficulty","cx":"High","infra":"Azure OpenAI · Cosmos DB · AI Search · Static Web Apps","tune":"difficulty scaling · knowledge gaps · progress tracking"},{"id":"75","name":"Exam Generation Engine","desc":"Auto-generate exams with difficulty calibration, rubrics, and answer keys","cx":"Medium","infra":"Azure OpenAI · Blob Storage · Cosmos DB · Functions","tune":"difficulty level · question variation · rubric detail"},{"id":"76","name":"Accessibility Learning Agent","desc":"Screen reader-first, dyslexia-aware learning with multi-modal adaptation","cx":"High","infra":"AI Speech · Azure OpenAI · AI Vision · Container Apps · Cosmos DB","tune":"accessibility profiles · content adaptation · speech rate"},{"id":"77","name":"Research Paper AI","desc":"Literature review, citation network, methodology critique, research gap analysis","cx":"Very High","infra":"Azure OpenAI · AI Search · Cosmos DB · Graph · Functions","tune":"citation depth · methodology rules · gap sensitivity"},{"id":"78","name":"Precision Agriculture Agent","desc":"Satellite imagery + IoT sensor fusion for crop health, irrigation, fertilization, yield prediction","cx":"Very High","infra":"Azure IoT Hub · AI Vision · Azure OpenAI · Digital Twins · ML","tune":"sensor sampling · imagery frequency · irrigation thresholds"},{"id":"79","name":"Food Safety Inspector AI","desc":"HACCP compliance, contamination detection, farm-to-fork traceability, pathogen risk scoring","cx":"High","infra":"Document Intelligence · Azure OpenAI · Cosmos DB · Event Hubs · IoT Hub","tune":"temperature alerts · pathogen models · audit retention"},{"id":"80","name":"Biodiversity Monitor","desc":"Species identification from camera trap, drone, acoustic data with conservation alerts","cx":"High","infra":"AI Vision · Azure OpenAI · IoT Hub · Cosmos DB · Functions","tune":"species confidence · camera schedule · acoustic frequency"},
    {"id":"81","name":"Property Valuation AI","desc":"Automated property appraisal with comparable sales, market trends, neighborhood scoring, satellite imagery","cx":"High","infra":"Azure OpenAI · AI Search · Cosmos DB · Machine Learning · Functions","tune":"comparable radius · market trend window · neighborhood scores"},{"id":"82","name":"Construction Safety AI","desc":"Real-time site monitoring — PPE compliance, hazard detection, unauthorized zone alerts, incident reporting","cx":"High","infra":"AI Vision · IoT Hub · Azure OpenAI · Container Apps · Cosmos DB","tune":"PPE confidence · hazard zones · alert escalation"},{"id":"83","name":"Building Energy Optimizer","desc":"HVAC, lighting, occupancy optimization via digital twin — 20-40% energy reduction","cx":"Very High","infra":"Digital Twins · IoT Hub · Azure OpenAI · Functions · Cosmos DB","tune":"HVAC schedule · occupancy model · comfort vs efficiency"},
    {"id":"84","name":"Citizen Services Chatbot","desc":"Multi-language municipal AI assistant — form filling, appointments, permits, FAQ, escalation","cx":"Medium","infra":"Azure OpenAI · AI Translator · Communication Services · AI Search · Cosmos DB","tune":"supported languages · escalation threshold · service catalog scope"},
    {"id":"85","name":"Policy Impact Analyzer","desc":"Regulatory change detection with cross-sector impact, stakeholder mapping, briefing generation","cx":"High","infra":"Azure OpenAI · AI Search · Document Intelligence · Cosmos DB · Functions","tune":"regulatory feeds · impact depth · stakeholder categories"},
    {"id":"86","name":"Public Safety Analytics","desc":"Crime pattern prediction, resource allocation, community sentiment, incident dashboard","cx":"Very High","infra":"Azure OpenAI · Machine Learning · Event Hubs · Cosmos DB · Stream Analytics","tune":"prediction window · allocation zones · sentiment feeds"},
    {"id":"87","name":"Dynamic Pricing Engine","desc":"Real-time price optimization with demand signals, competitor pricing, and fairness guardrails","cx":"High","infra":"Azure OpenAI · Event Hubs · Cosmos DB · Redis Cache · Machine Learning","tune":"price elasticity · competitor frequency · fairness guardrails"},
    {"id":"88","name":"Visual Product Search","desc":"Image-based product discovery with visual similarity, style recommendations, virtual try-on","cx":"High","infra":"AI Vision · Azure OpenAI · AI Search · Container Apps · Cosmos DB","tune":"similarity threshold · catalog refresh · try-on quality"},
    {"id":"89","name":"Retail Inventory Predictor","desc":"Demand forecasting with weather, social trends, economic indicators, automated reordering","cx":"High","infra":"Azure OpenAI · Machine Learning · Cosmos DB · Event Hubs · Functions","tune":"forecast horizon · safety stock · reorder formula"},
    {"id":"90","name":"Network Optimization Agent","desc":"5G/LTE network capacity planning with anomaly detection, self-healing, traffic prediction, and digital twin simulation","cx":"Very High","infra":"Azure IoT Hub · Stream Analytics · OpenAI · Digital Twins · Cosmos DB","tune":"traffic prediction horizon · anomaly sensitivity · self-healing triggers"},
    {"id":"91","name":"Customer Churn Predictor","desc":"Multi-signal churn scoring with usage patterns, billing, support, network quality, and retention campaigns","cx":"High","infra":"Azure OpenAI · Machine Learning · Cosmos DB · Communication Services · Functions","tune":"churn risk threshold · retention budget · signal decay weights"},
    {"id":"92","name":"Telecom Fraud Shield","desc":"Real-time telecom fraud detection for SIM swap, revenue share fraud, Wangiri, toll fraud with sub-second blocking","cx":"High","infra":"Azure Event Hubs · Stream Analytics · OpenAI · Cosmos DB · Functions","tune":"SIM swap detection window · fraud score threshold · velocity limits"},
    {"id":"93","name":"Continual Learning Agent","desc":"Agent that persists knowledge across sessions, reflects on failures, and starts smarter every time","cx":"Very High","infra":"Azure OpenAI · Cosmos DB · AI Search · Redis Cache · Functions","tune":"Memory retention policy · reflection triggers · distillation frequency"},
    {"id":"94","name":"AI Podcast Generator","desc":"Text-to-podcast with multi-speaker voice synthesis, music transitions, chapter markers, and content safety","cx":"High","infra":"Azure AI Speech · OpenAI · Blob Storage · CDN · Functions","tune":"Voice persona · speaking rate · music transition style"},
    {"id":"95","name":"Multimodal Search Engine v2","desc":"Unified search across images, text, code, and audio with cross-modal reasoning and GPT-4o synthesis","cx":"Very High","infra":"Azure AI Search · AI Vision · AI Speech · OpenAI · Container Apps","tune":"Cross-modal fusion weights · index config · result diversity"},
    {"id":"96","name":"Real-Time Voice Agent v2","desc":"Next-gen bidirectional voice agent with sub-200ms latency, MCP tools, avatar rendering, and transcription","cx":"Very High","infra":"Azure AI Voice Live · OpenAI · Container Apps · Functions · Cosmos DB","tune":"VAD mode · latency target · function calling timeout"},
    {"id":"97","name":"AI Data Marketplace","desc":"Platform for publishing, discovering, and monetizing synthetic and anonymized datasets with differential privacy","cx":"High","infra":"Azure Machine Learning · Blob Storage · API Management · Cosmos DB · Functions","tune":"Privacy epsilon budget · pricing model · data quality thresholds"},
    {"id":"98","name":"Agent Evaluation Platform","desc":"Automated evaluation suite with benchmarks, A/B testing, human scoring, and leaderboard ranking","cx":"High","infra":"Azure OpenAI · Container Apps · Cosmos DB · Machine Learning · Functions","tune":"Benchmark suite · regression threshold · A/B traffic split"},
    {"id":"99","name":"Enterprise AI Governance Hub","desc":"Central control plane for AI models, agents, APIs — approval gates, policy, compliance tracking","cx":"Very High","infra":"Azure API Management · Policy · Monitor · Cosmos DB · ML · Key Vault","tune":"Approval thresholds · policy rules · compliance frameworks"},
    {"id":"100","name":"FAI Meta-Agent","desc":"The crown jewel — self-orchestrating super-agent that selects plays, provisions infra, and delivers production AI","cx":"Very High","infra":"Azure OpenAI · MCP Server · Container Apps · Cosmos DB · AI Search · Key Vault","tune":"Play selection strategy · chain depth · budget per orchestration"},
]

COST_DATA = {
    "dev": {"azure-openai": 15, "ai-search": 50, "container-apps": 30, "key-vault": 1, "blob-storage": 2, "app-insights": 5},
    "prod": {"azure-openai": 150, "ai-search": 250, "container-apps": 200, "key-vault": 3, "blob-storage": 20, "app-insights": 30},
}

class FrootAIMCP:
    def __init__(self):
        self.knowledge = self._load_knowledge()
        self.modules = self.knowledge.get("modules", {})
        self.layers = self.knowledge.get("layers", {})
        self.version = self.knowledge.get("version", "3.2.0")
        self._glossary_cache = None
        self.tools = self._register_tools()

    def _load_knowledge(self):
        p = Path(__file__).parent / "knowledge.json"
        if not p.exists():
            raise FileNotFoundError(f"knowledge.json not found at {p}")
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)

    def _build_glossary(self):
        if self._glossary_cache: return self._glossary_cache
        g = {}
        for m in self.modules.values():
            for match in re.finditer(r'\*\*([^*]{2,60})\*\*\s*[—:–]\s*([^\n]{10,})', m.get("content","")):
                g[match.group(1).strip().lower()] = {"term": match.group(1).strip(), "definition": match.group(2).strip()}
        self._glossary_cache = g
        return g

    def _register_tools(self):
        return [
            {"name":"get_module","description":"Get a FROOT knowledge module by ID (F1,R1,O1,T1...)","inputSchema":{"type":"object","properties":{"module_id":{"type":"string"}},"required":["module_id"]}},
            {"name":"list_modules","description":"List all FROOT knowledge modules","inputSchema":{"type":"object","properties":{}}},
            {"name":"search_knowledge","description":"Full-text search across all modules","inputSchema":{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}},
            {"name":"lookup_term","description":"Look up an AI term (200+ terms)","inputSchema":{"type":"object","properties":{"term":{"type":"string"}},"required":["term"]}},
            {"name":"get_architecture_pattern","description":"Get architecture patterns for a scenario","inputSchema":{"type":"object","properties":{"scenario":{"type":"string"}},"required":["scenario"]}},
            {"name":"get_froot_overview","description":"FrootAI platform overview","inputSchema":{"type":"object","properties":{}}},
            {"name":"list_solution_plays","description":"List all 100 solution plays","inputSchema":{"type":"object","properties":{}}},
            {"name":"get_solution_play","description":"Get a specific solution play","inputSchema":{"type":"object","properties":{"play_id":{"type":"string"}},"required":["play_id"]}},
            {"name":"estimate_cost","description":"Estimate Azure costs for a play","inputSchema":{"type":"object","properties":{"play":{"type":"string"},"scale":{"type":"string","enum":["dev","prod"]}},"required":["play"]}},
            {"name":"validate_config","description":"Validate AI configuration","inputSchema":{"type":"object","properties":{"config":{"type":"object"}},"required":["config"]}},
            {"name":"semantic_search_plays","description":"Find best play for your scenario","inputSchema":{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}},
            {"name":"agent_build","description":"Get build guidance for an AI agent","inputSchema":{"type":"object","properties":{"scenario":{"type":"string"}},"required":["scenario"]}},
            {"name":"agent_review","description":"Review agent configuration","inputSchema":{"type":"object","properties":{"config":{"type":"string"}},"required":["config"]}},
            {"name":"agent_tune","description":"Get tuning recommendations","inputSchema":{"type":"object","properties":{"config":{"type":"string"}},"required":["config"]}},
            {"name":"get_github_agentic_os","description":"Explain .github Agentic OS","inputSchema":{"type":"object","properties":{}}},
            {"name":"list_community_plays","description":"List community plugins","inputSchema":{"type":"object","properties":{}}},
            {"name":"get_model_catalog","description":"AI model comparison guide","inputSchema":{"type":"object","properties":{"use_case":{"type":"string"}},"required":["use_case"]}},
            {"name":"get_azure_pricing","description":"Azure AI pricing info","inputSchema":{"type":"object","properties":{"service":{"type":"string"}},"required":["service"]}},
            {"name":"compare_models","description":"Compare AI models","inputSchema":{"type":"object","properties":{"task":{"type":"string"}},"required":["task"]}},
            {"name":"fetch_azure_docs","description":"Azure docs summary","inputSchema":{"type":"object","properties":{"topic":{"type":"string"}},"required":["topic"]}},
            {"name":"fetch_external_mcp","description":"Find external MCP servers","inputSchema":{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}},
            {"name":"get_play_spec","description":"Get SpecKit for a play","inputSchema":{"type":"object","properties":{"play_id":{"type":"string"}},"required":["play_id"]}},
            {"name":"compare_plays","description":"Compare two solution plays side by side","inputSchema":{"type":"object","properties":{"play1":{"type":"string"},"play2":{"type":"string"}},"required":["play1","play2"]}},
            {"name":"generate_architecture_diagram","description":"Generate Mermaid.js architecture diagram for a solution play","inputSchema":{"type":"object","properties":{"play":{"type":"string"}},"required":["play"]}},
            {"name":"embedding_playground","description":"Compare two texts for semantic similarity (educational tool)","inputSchema":{"type":"object","properties":{"text1":{"type":"string"},"text2":{"type":"string"}},"required":["text1","text2"]}},
        ]

    def handle_request(self, request):
        method = request.get("method",""); req_id = request.get("id"); params = request.get("params",{})
        if method == "initialize":
            return self._resp(req_id, {"protocolVersion":"2024-11-05","capabilities":{"tools":{"listChanged":False}},"serverInfo":{"name":"frootai-mcp","version":self.version}})
        elif method == "tools/list": return self._resp(req_id, {"tools": self.tools})
        elif method == "tools/call": return self._call_tool(req_id, params)
        elif method in ("notifications/initialized","ping"): return self._resp(req_id, {}) if req_id else None
        return self._err(req_id, -32601, f"Unknown method: {method}")

    def _call_tool(self, req_id, params):
        name = params.get("name",""); args = params.get("arguments",{})
        h = {"get_module":self._get_module,"list_modules":self._list_modules,"search_knowledge":self._search_knowledge,
             "lookup_term":self._lookup_term,"get_architecture_pattern":self._get_arch,"get_froot_overview":self._overview,
             "list_solution_plays":self._list_plays,"get_solution_play":self._get_play,"estimate_cost":self._cost,
             "validate_config":self._validate,"semantic_search_plays":self._search_plays,"agent_build":self._build,
             "agent_review":self._review,"agent_tune":self._tune,"get_github_agentic_os":self._agentic_os,
             "list_community_plays":self._community,"get_model_catalog":self._models,"get_azure_pricing":self._pricing,
             "compare_models":self._compare,"fetch_azure_docs":self._azure_docs,"fetch_external_mcp":self._ext_mcp,"get_play_spec":self._spec,
             "compare_plays":self._compare_plays,"generate_architecture_diagram":self._generate_diagram,"embedding_playground":self._embedding_playground}
        fn = h.get(name)
        if not fn: return self._err(req_id, -32602, f"Unknown tool: {name}")
        try:
            r = fn(args)
            return self._resp(req_id, {"content":[{"type":"text","text":json.dumps(r,indent=2,ensure_ascii=False)}]})
        except Exception as e:
            return self._err(req_id, -32603, str(e))

    # ─── REAL TOOL IMPLEMENTATIONS ───
    def _get_module(self, a):
        mid = a.get("module_id","").upper().strip()
        if mid in self.modules:
            m = self.modules[mid]
            return {"id":m["id"],"title":m["title"],"layer":m.get("layer",""),"content":m["content"][:8000],"total_chars":len(m["content"])}
        q = a.get("module_id","").lower()
        for k,m in self.modules.items():
            if q in m.get("title","").lower() or q in k.lower():
                return {"id":m["id"],"title":m["title"],"layer":m.get("layer",""),"content":m["content"][:8000],"total_chars":len(m["content"])}
        return {"error":f"Module '{mid}' not found","available":[{"id":k,"title":v["title"]} for k,v in self.modules.items()]}

    def _list_modules(self, a):
        mods = [{"id":k,"title":v["title"],"layer":v.get("layer",""),"emoji":v.get("emoji",""),"chars":len(v.get("content",""))} for k,v in self.modules.items()]
        return {"count":len(mods),"modules":mods,"layers":{k:(v.get("name",k) if isinstance(v,dict) else v) for k,v in self.layers.items()}}

    def _search_knowledge(self, a):
        q = a.get("query","").lower().strip()
        if not q: return {"error":"Query required"}
        results = []
        for k,m in self.modules.items():
            c = m.get("content",""); cl = c.lower()
            if q in cl:
                idx = cl.index(q); s = max(0,idx-200); e = min(len(c),idx+len(q)+300)
                results.append({"module":k,"title":m["title"],"excerpt":f"...{c[s:e].strip()}...","hits":cl.count(q)})
        results.sort(key=lambda x:x["hits"],reverse=True)
        return {"query":q,"results":results[:10],"total":len(results)}

    def _lookup_term(self, a):
        t = a.get("term","").lower().strip(); g = self._build_glossary()
        if t in g: return g[t]
        matches = [v for k,v in g.items() if t in k or k in t]
        if matches: return {"matches":matches[:5]}
        for k,m in self.modules.items():
            c = m.get("content","")
            if t in c.lower():
                idx = c.lower().index(t); return {"term":t,"found_in":m["title"],"context":c[max(0,idx-100):min(len(c),idx+300)].strip()}
        return {"error":f"Term '{t}' not found"}

    def _get_arch(self, a):
        sc = a.get("scenario","").lower()
        ps = [{"play":f"{p['id']}—{p['name']}","desc":p["desc"],"infra":p["infra"]} for p in PLAYS if any(w in (p["desc"]+p["name"]).lower() for w in sc.split() if len(w)>2)]
        km = [{"module":k,"title":m["title"]} for k,m in self.modules.items() if sc.split()[0] in m.get("content","").lower()] if sc.split() else []
        return {"scenario":sc,"matching_plays":ps[:5],"relevant_modules":km[:3]}

    def _overview(self, a):
        return {"name":"FrootAI","tagline":"From the Roots to the Fruits. It's simply Frootful.","version":self.version,
                "framework":"FROOT = Foundations · Reasoning · Orchestration · Operations · Transformation",
                "stats":{"tools":22,"modules":len(self.modules),"plays":len(PLAYS),"terms":len(self._build_glossary()),"knowledge":"682KB"},
                "channels":["npm","pip","VS Code","Docker","CLI","REST API"],"website":"https://frootai.dev"}

    def _list_plays(self, a): return {"count":len(PLAYS),"plays":PLAYS}

    def _get_play(self, a):
        pid = a.get("play_id","").strip()
        for p in PLAYS:
            if p["id"]==pid.zfill(2) or pid.lower() in p["name"].lower(): return p
        return {"error":f"Play '{pid}' not found"}

    def _cost(self, a):
        sc = a.get("scale","dev"); costs = COST_DATA.get(sc, COST_DATA["dev"])
        return {"play":a.get("play",""),"scale":sc,"monthly_usd":costs,"total":sum(costs.values()),"note":"Estimates based on Azure retail pricing."}

    def _validate(self, a):
        cfg = a.get("config",{}); issues=[]; warns=[]
        t = cfg.get("temperature")
        if t is not None and t > 0.5: warns.append(f"temperature={t} — lower for production")
        if not cfg.get("max_tokens"): warns.append("No max_tokens limit set")
        if not cfg.get("blocked_categories") and not cfg.get("content_safety"): warns.append("No content safety configured")
        return {"valid":len(issues)==0,"issues":issues,"warnings":warns}

    def _search_plays(self, a):
        q = a.get("query","").lower()
        scored = []
        for p in PLAYS:
            s = sum(1 for w in q.split() if w in (p["name"]+p["desc"]+p["infra"]).lower())
            if s>0: scored.append({**p,"score":s})
        scored.sort(key=lambda x:x["score"],reverse=True)
        return {"query":q,"matches":scored[:5]}

    def _build(self, a):
        m = self._search_plays({"query":a.get("scenario","")})
        bp = m["matches"][0] if m["matches"] else PLAYS[0]
        return {"scenario":a.get("scenario",""),"recommended":f"{bp['id']}—{bp['name']}","steps":["1. npx frootai scaffold <play>","2. code . (MCP auto-connects)","3. @builder in Copilot Chat","4. npx frootai validate --waf"]}

    def _review(self, a):
        c = a.get("config","").lower()
        checks = {"instructions":"instruction" in c or "you are" in c,"guardrails":any(w in c for w in ["guardrail","safety","block"]),
                   "grounding":any(w in c for w in ["ground","cite","source"]),"evaluation":any(w in c for w in ["eval","test","threshold"])}
        return {"checks":checks,"passed":f"{sum(checks.values())}/{len(checks)}"}

    def _tune(self, a):
        return {"recommendations":["temperature=0.1 for production","grounding_check=true","Set max_tokens budget","blocked_categories for safety","semantic reranker with top_k=5","Run evaluation before shipping"]}

    def _agentic_os(self, a):
        return {"name":".github Agentic OS","files":19,"layers":{"1":"Instructions (always-on)","2":"Agents & Skills","3":"Hooks & Workflows","4":"Plugin Packaging"},"init":"npx frootai init"}

    def _community(self, a):
        return {"plays":[{"name":"servicenow-ai-agent","desc":"ServiceNow ITSM"},{"name":"salesforce-ai-copilot","desc":"Salesforce CRM"},{"name":"sap-ai-gateway","desc":"SAP S/4HANA"}],"marketplace":"https://frootai.dev/marketplace"}

    def _models(self, a):
        return {"models":[{"name":"GPT-4o","best_for":"Complex reasoning","cost":"$$$$"},{"name":"GPT-4o-mini","best_for":"Fast + cheap","cost":"$$"},{"name":"Phi-4","best_for":"Edge/on-device","cost":"$"}]}

    def _pricing(self, a):
        s = a.get("service","").lower()
        p = {"openai":{"gpt-4o-mini":"$0.15/1M in, $0.60/1M out","gpt-4o":"$2.50/1M in, $10/1M out"},"ai-search":{"basic":"$69/mo","standard":"$249/mo"},"container-apps":{"consumption":"$0.000024/vCPU-sec"}}
        for k,v in p.items():
            if k in s or s in k: return {"service":k,"pricing":v}
        return {"services":list(p.keys())}

    def _compare(self, a):
        return {"comparison":[{"model":"GPT-4o","quality":9.5,"speed":7,"cost":3},{"model":"GPT-4o-mini","quality":8,"speed":9,"cost":8},{"model":"Phi-4","quality":7,"speed":10,"cost":10}]}

    def _azure_docs(self, a):
        t = a.get("topic","")
        return {"topic":t,"url":f"https://learn.microsoft.com/azure/?q={t.replace(' ','+')}","tip":"Use search_knowledge for curated FrootAI content."}

    def _ext_mcp(self, a):
        return {"registries":["https://mcp.so","https://glama.ai/mcp/servers"],"tip":"FrootAI itself is an MCP server: npx frootai-mcp or pip install frootai-mcp"}

    def _spec(self, a):
        pid = a.get("play_id","01").zfill(2)
        p = next((x for x in PLAYS if x["id"]==pid),PLAYS[0])
        return {"play":p["name"],"spec":{"pattern":p["desc"],"complexity":p["cx"],"infra":p["infra"],"waf":{"reliability":"retry + health","security":"managed identity + PE","cost":"right-sized SKUs","operations":"CI/CD + diagnostics","performance":"caching + streaming","responsible_ai":"content safety + guardrails"}}}

    def _compare_plays(self, a):
        p1 = a.get("play1","01").zfill(2); p2 = a.get("play2","02").zfill(2)
        d1 = next((x for x in PLAYS if x["id"]==p1),PLAYS[0])
        d2 = next((x for x in PLAYS if x["id"]==p2),PLAYS[1])
        return {"play1":{"id":d1["id"],"name":d1["name"],"complexity":d1["cx"],"infra":d1["infra"]},"play2":{"id":d2["id"],"name":d2["name"],"complexity":d2["cx"],"infra":d2["infra"]},"differences":{"complexity":f"{d1['cx']} vs {d2['cx']}","infra_overlap":[s for s in d1["infra"].split(" · ") if s in d2["infra"]]}}

    def _generate_diagram(self, a):
        pid = a.get("play","01").zfill(2)
        p = next((x for x in PLAYS if x["id"]==pid),PLAYS[0])
        services = [s.strip() for s in p["infra"].split("·")]
        nodes = "\n".join(f"    {s.replace(' ','_')}[{s}]" for s in services)
        links = "\n".join(f"    {services[i].replace(' ','_')} --> {services[i+1].replace(' ','_')}" for i in range(len(services)-1))
        mermaid = f"graph LR\n{nodes}\n{links}"
        return {"play":p["name"],"diagram_type":"mermaid","mermaid":mermaid,"tip":"Paste into any Mermaid renderer to visualize."}

    def _embedding_playground(self, a):
        t1 = a.get("text1","").lower(); t2 = a.get("text2","").lower()
        w1 = set(t1.split()); w2 = set(t2.split())
        overlap = w1 & w2; union = w1 | w2
        sim = len(overlap)/max(len(union),1)
        return {"text1_words":len(w1),"text2_words":len(w2),"overlap":list(overlap)[:10],"jaccard_similarity":round(sim,3),"note":"Keyword-based approximation. Real embeddings use text-embedding-3-large with 3072 dimensions."}

    # ─── Protocol ───
    def _resp(self, rid, result): return {"jsonrpc":"2.0","id":rid,"result":result}
    def _err(self, rid, code, msg): return {"jsonrpc":"2.0","id":rid,"error":{"code":code,"message":msg}}

    def run(self):
        for line in sys.stdin:
            line = line.strip()
            if not line: continue
            try:
                req = json.loads(line); resp = self.handle_request(req)
                if resp: sys.stdout.write(json.dumps(resp)+"\n"); sys.stdout.flush()
            except json.JSONDecodeError:
                sys.stdout.write(json.dumps(self._err(None,-32700,"Parse error"))+"\n"); sys.stdout.flush()
            except Exception as e:
                sys.stdout.write(json.dumps(self._err(None,-32603,str(e)))+"\n"); sys.stdout.flush()

def main():
    FrootAIMCP().run()

if __name__ == "__main__":
    main()

