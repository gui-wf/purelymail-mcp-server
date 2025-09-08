#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import createClient from "openapi-fetch";
import type { paths } from "./types/purelymail-api.js";
import { createToolsFromSpec } from "./tools/openapi-fetch-generator.js";
import { MockApiClient } from "./mocks/mock-client.js";

const server = new Server(
  {
    name: "purelymail-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

async function initializeServer() {
  const apiKey = process.env.PURELYMAIL_API_KEY;
  const mockMode = process.env.MOCK_MODE === 'true';

  if (mockMode) {
    console.error("Running in MOCK MODE - using test responses");
  } else {
    console.error(`API connection to PurelyMail initialized`);
  }

  if (!apiKey && !mockMode) {
    console.error("PurelyMail API key required. Set PURELYMAIL_API_KEY environment variable.");
    process.exit(1);
  }

  // Use openapi-fetch client or mock
  let client: any;
  if (mockMode) {
    client = new MockApiClient();
  } else {
    client = createClient<paths>({
      baseUrl: 'https://purelymail.com',
      headers: {
        'Content-Type': 'application/json',
        'Purelymail-Api-Token': apiKey!
      }
    });
  }

  // Generate tools from swagger spec
  const tools = await createToolsFromSpec(client);

  // Set up tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  }));

  // Set up tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};
    
    const tool = tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    try {
      const result = await tool.execute(args);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error.message}`
          }
        ],
        isError: true
      };
    }
  });

  console.error(`Registered ${tools.length} tools from swagger spec`);

  // Connect to transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

initializeServer().catch(console.error);