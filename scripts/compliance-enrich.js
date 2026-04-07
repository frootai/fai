// Add compliance-specific content to healthcare and government plays
const fs = require("fs"), path = require("path");
const dir = "solution-plays";

const complianceContent = {
    "46": {
        folder: null,
        domain: "Healthcare Clinical AI",
        section: `

## Regulatory Compliance — HIPAA & HITRUST

### HIPAA (Health Insurance Portability and Accountability Act)
This solution MUST comply with HIPAA requirements:
- **Privacy Rule:** All Protected Health Information (PHI) must be encrypted at rest and in transit
- **Security Rule:** Administrative, physical, and technical safeguards required
- **Breach Notification Rule:** 60-day notification window for unauthorized PHI access
- **Business Associate Agreement (BAA):** Required with all cloud service providers including Microsoft Azure
- **Minimum Necessary Standard:** Only access the minimum PHI needed for each operation
- **Audit Logging:** All PHI access must be logged with user identity, timestamp, action, and resource

### HITRUST CSF (Health Information Trust Alliance)
- Align with HITRUST Common Security Framework (CSF) v11
- Map controls to NIST 800-53 and ISO 27001
- Implement HITRUST assessment readiness checklist
- Annual HITRUST certification renewal required

### PHI Handling Requirements
- All PHI must be encrypted with AES-256 at rest
- TLS 1.2+ required for all PHI in transit
- PHI must never appear in application logs (use tokenized references)
- De-identification required before any analytics or AI model training
- PHI retention policy: minimum required by state law, maximum 6 years post-treatment
- Right to access: patients can request their PHI within 30 days
- Azure Health Data Services FHIR API for standardized PHI exchange

### Azure BAA Requirements
- Azure is a HIPAA BAA-covered service
- Enable Microsoft Defender for Cloud on all healthcare workloads
- Use Azure Confidential Computing for sensitive PHI processing
- Enable Customer Lockbox for Microsoft support access to PHI data
- Azure Policy: enforce HIPAA HITRUST compliance initiative

### Audit Logging for Healthcare
- Log all PHI access events with: user_id, patient_id (tokenized), action, timestamp, ip_address
- Log all clinical decision support outputs with confidence scores
- Retain audit logs for minimum 6 years (HIPAA requirement)
- Azure Sentinel integration for SIEM and anomaly detection
- Weekly audit log review and quarterly compliance reporting
`,
    },
    "84": {
        folder: null,
        domain: "Government Citizen Services",
        section: `

## Regulatory Compliance — FedRAMP & Government Standards

### FedRAMP (Federal Risk and Authorization Management Program)
This solution targets FedRAMP Moderate (IL2) or FedRAMP High (IL4) authorization:
- **NIST SP 800-53 Rev 5:** Implement all applicable security controls
- **Continuous monitoring:** Monthly vulnerability scans, annual penetration testing
- **Plan of Action and Milestones (POA&M):** Track remediation of identified risks
- **Authorization boundary:** Document all system components and data flows
- **Azure Government:** Deploy on Azure Government cloud (IL4/IL5 accredited)

### FISMA (Federal Information Security Modernization Act)
- Annual security assessment and authorization required
- Implement NIST Cybersecurity Framework (CSF)
- Chief Information Security Officer (CISO) oversight
- Incident response plan with 1-hour notification for significant incidents

### IL4/IL5 (Impact Level 4/5) Requirements
- **IL4:** Controlled Unclassified Information (CUI) in Azure Government
- **IL5:** Higher-impact CUI — requires Azure Government Secret or dedicated regions
- Data must remain within US sovereign boundaries
- FIPS 140-2 validated cryptographic modules required for all encryption
- Azure Government regions: USGov Virginia, USGov Texas, USGov Arizona

### FIPS 140-2 Compliance
- All encryption must use FIPS 140-2 Level 2 validated modules
- Azure Key Vault (FIPS 140-2 Level 2) for key management
- Azure Storage Service Encryption with Microsoft-managed or CMK keys
- TLS 1.2+ with FIPS-approved cipher suites only
- Database encryption: Azure SQL TDE with FIPS-validated modules

### Azure Government Deployment
- Deploy exclusively on Azure Government cloud
- Use Azure Government-specific endpoints for all services
- Configure Azure Policy with FedRAMP High compliance initiative
- Enable Microsoft Defender for Government workloads
- Use Azure Government-accredited AI services (Azure OpenAI on Gov cloud)
- Government Community Cloud (GCC) for Microsoft 365 integration

### Access Controls
- Multi-factor authentication (MFA) required for all users
- PIV/CAC smart card authentication for government users
- Role-based access control (RBAC) with least-privilege principle
- Privileged access workstation (PAW) for administrative operations
- Session timeout: 15 minutes of inactivity
`,
    },
    "85": {
        folder: null,
        domain: "Government Policy Analysis",
        section: `

## Regulatory Compliance — Government Data Sovereignty

### FedRAMP Authorization
- Target FedRAMP Moderate authorization baseline
- Implement NIST SP 800-53 Rev 5 security controls
- Continuous monitoring with monthly vulnerability scans
- Annual third-party security assessment

### Data Sovereignty Requirements
- All data must remain within US sovereign territory
- Azure Government cloud deployment mandatory
- Cross-border data transfer prohibited without explicit authorization
- Data residency verification: regular audits of storage locations
- Backup and disaster recovery within same sovereignty boundary

### Classified Handling Procedures
- Controlled Unclassified Information (CUI) marking and handling
- CUI Registry categories: Privacy, Proprietary, Legal, Financial, Government
- Need-to-know access enforcement with document-level access controls
- CUI destruction procedures: cryptographic erasure for digital, cross-cut shred for physical
- Spillage procedures: immediate containment, assessment, reporting

### Access Controls for Policy Systems
- Government-issued credentials required (PIV/CAC)
- Role-based access: Analyst, Reviewer, Approver, Administrator
- Separation of duties: policy creation and approval by different users
- Access reviews: quarterly recertification of all user accounts
- Privileged access: just-in-time (JIT) with approval workflow
`,
    },
    "86": {
        folder: null,
        domain: "Government Public Safety",
        section: `

## Regulatory Compliance — CJIS & Public Safety Standards

### CJIS (Criminal Justice Information Services) Security Policy
This solution handles Criminal Justice Information (CJI) and must comply:
- **CJIS Security Policy v5.9:** All 13 policy areas implemented
- **Advanced authentication:** MFA required for all CJI access
- **Encryption:** AES-256 for CJI at rest, TLS 1.2+ in transit (FIPS 140-2)
- **Auditing:** All CJI access logged with user, action, timestamp, reason
- **Personnel security:** Background checks for all personnel accessing CJI
- **Media protection:** CJI on mobile devices must be encrypted and remotely wipeable
- **Physical protection:** Data centers meet CJIS physical security requirements

### FedRAMP for Public Safety
- Azure Government meets FedRAMP High baseline
- CJIS Security Addendum with Microsoft Azure
- Regular CJIS compliance audits and assessments
- State-level CJIS Systems Agency (CSA) approval required

### Real-Time Data Processing Requirements
- Maximum latency for safety-critical alerts: 500ms
- Event-driven architecture for real-time incident detection
- Redundant data streams with automatic failover
- Data retention: 7 years for incident records (state-dependent)
- Chain of custody for digital evidence (tamper-proof audit trail)

### PII Protection in Public Safety
- Personally Identifiable Information (PII) classification and tagging
- PII minimization: collect only what's needed for safety operations
- PII encryption: field-level encryption for sensitive attributes
- PII access logging: every access to PII records audited
- PII breach notification: within 24 hours for safety-critical PII
- De-identification for analytics: aggregate reporting without individual PII
- Azure Purview for automated PII discovery and classification

### Audit Trail Requirements
- Immutable audit log for all system actions
- Write-once storage (Azure Immutable Blob Storage) for audit records
- Audit log fields: timestamp, user_id, action, resource, ip_address, outcome, justification
- Audit log retention: minimum 7 years
- Real-time audit log streaming to SIEM (Azure Sentinel)
- Quarterly audit log review and annual compliance reporting
- Tamper detection: cryptographic hashing of audit records
`,
    },
};

// Find actual folder names
const allDirs = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
for (const [id, data] of Object.entries(complianceContent)) {
    data.folder = allDirs.find(d => d.startsWith(id + "-"));
}

// Apply compliance content to each play's key files
let totalUpdated = 0;
for (const [id, data] of Object.entries(complianceContent)) {
    if (!data.folder) { console.log(`❌ Play ${id} folder not found`); continue; }
    const playDir = path.join(dir, data.folder);

    // Files to append compliance section to
    const targets = [
        ".github/copilot-instructions.md",
        ".github/instructions/security.instructions.md",
        "README.md",
        "agent.md",
    ];

    for (const target of targets) {
        const fp = path.join(playDir, target);
        if (!fs.existsSync(fp)) continue;
        const content = fs.readFileSync(fp, "utf8");
        // Only append if not already there
        if (!content.includes("Regulatory Compliance")) {
            fs.writeFileSync(fp, content + data.section);
            totalUpdated++;
        }
    }

    // Update guardrails.json with compliance metadata
    const guardrailsPath = path.join(playDir, "config/guardrails.json");
    if (fs.existsSync(guardrailsPath)) {
        try {
            const g = JSON.parse(fs.readFileSync(guardrailsPath, "utf8"));
            if (id === "46") {
                g.compliance = { frameworks: ["HIPAA", "HITRUST"], phi_handling: "required", baa_required: true, audit_retention_years: 6 };
            } else if (id === "84") {
                g.compliance = { frameworks: ["FedRAMP", "FISMA", "FIPS-140-2"], impact_level: "IL4", cloud: "Azure Government", mfa_required: true };
            } else if (id === "85") {
                g.compliance = { frameworks: ["FedRAMP", "NIST-800-53"], data_sovereignty: "US", cui_handling: "required", clearance_required: false };
            } else if (id === "86") {
                g.compliance = { frameworks: ["CJIS", "FedRAMP"], pii_protection: "field_level_encryption", audit_retention_years: 7, real_time_latency_ms: 500 };
            }
            fs.writeFileSync(guardrailsPath, JSON.stringify(g, null, 2));
            totalUpdated++;
        } catch (e) { console.log(`  ⚠️ guardrails parse error: ${e.message}`); }
    }

    // Update main.bicep with compliance comments
    const bicepPath = path.join(playDir, "infra/main.bicep");
    if (fs.existsSync(bicepPath)) {
        const bicep = fs.readFileSync(bicepPath, "utf8");
        if (!bicep.includes("Compliance")) {
            let complianceHeader = "";
            if (id === "46") complianceHeader = "// COMPLIANCE: HIPAA + HITRUST — BAA required, PHI encrypted, audit logging enabled\n// Deploy on Azure commercial with HIPAA BAA in place\n\n";
            else if (id === "84") complianceHeader = "// COMPLIANCE: FedRAMP High + FISMA — Azure Government IL4/IL5\n// Deploy on Azure Government with FIPS 140-2 encryption\n\n";
            else if (id === "85") complianceHeader = "// COMPLIANCE: FedRAMP Moderate — Data sovereignty US only\n// Deploy on Azure Government with CUI handling controls\n\n";
            else if (id === "86") complianceHeader = "// COMPLIANCE: CJIS + FedRAMP — Public safety data protection\n// Deploy on Azure Government with CJIS Security Addendum\n\n";
            fs.writeFileSync(bicepPath, complianceHeader + bicep);
            totalUpdated++;
        }
    }

    console.log(`✅ Play ${id} (${data.folder}): compliance content added`);
}

console.log(`\nTotal files updated: ${totalUpdated}`);
