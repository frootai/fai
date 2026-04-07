---
name: frootai-mcp-csharp-generator
description: 'Scaffolds a complete C#/.NET MCP server project with ModelContextProtocol NuGet, dependency injection, [McpServerTool] attributes, IHostedService lifecycle, and Azure Managed Identity integration.'
---

# FrootAI MCP C# Generator

Scaffold a production-ready C#/.NET MCP server.

## Parameters

- **Server Name**: ${SERVER_NAME="MyMcpServer"}
- **Tools**: ${TOOL_COUNT="1|3|5|10"}
- **Azure Integration**: ${AZURE="None|KeyVault|Search|OpenAI|Full"}

## Generated Files

```
{SERVER_NAME}/
├── {SERVER_NAME}.csproj       # NuGet refs: ModelContextProtocol, Azure.Identity
├── Program.cs                  # Host builder with MCP server setup
├── Tools/
│   └── ExampleTools.cs         # [McpServerTool] sample implementations
├── Services/
│   └── IExampleService.cs      # DI interface pattern
├── Dockerfile
├── README.md
└── appsettings.json            # Non-secret configuration
```

## Key Patterns

```csharp
// Program.cs
var builder = Host.CreateApplicationBuilder(args);
builder.Services
    .AddMcpServer()
    .WithStdioTransport()
    .WithTools<ExampleTools>();
builder.Services.AddSingleton<IExampleService, ExampleService>();
var host = builder.Build();
await host.RunAsync();
```

## Verification

- `dotnet build` compiles without errors
- `dotnet run` starts MCP server on stdio
- [Description] attributes present on all tools and parameters
- DefaultAzureCredential used for Azure services (no keys)
