// Centralized endpoint registry — all external URLs in one place
export const ENDPOINTS = {
  FROOTAI_WEBSITE: process.env.FAI_WEBSITE_URL || "https://frootai.dev",
  GITHUB_RAW: process.env.FAI_GITHUB_RAW_URL || "https://raw.githubusercontent.com/frootai/frootai/main",
  GITHUB_API: process.env.FAI_GITHUB_API_URL || "https://api.github.com/repos/frootai/frootai",
  MICROSOFT_LEARN_API: process.env.FAI_MS_LEARN_URL || "https://learn.microsoft.com/api/search",
  MCP_REGISTRY: process.env.FAI_MCP_REGISTRY_URL || "https://registry.mcp.so/api",
  GITHUB_COMMUNITY_PLAYS: process.env.FAI_COMMUNITY_PLAYS_URL || "https://api.github.com/repos/frootai/frootai/contents/solution-plays",
};
