#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import commandLineArgs from "command-line-args";

const TB_MCP_HOST = process.env.TB_MCP_HOST || "https://mcp.tollbit.dev/mcp";

const optionDefinitions = [{ name: "api-key", alias: "k", type: String }];
const options = commandLineArgs(optionDefinitions);

const API_KEY = options["api-key"];
if (!options["api-key"]) {
  console.error(
    "API key is required, pass it using `--api-key my-secret-api-key`. Exiting..."
  );
  process.exit(1);
}

console.error("Starting dynamic MCP bridge...");
console.error("Dynamic server URL:", TB_MCP_HOST);

// Initialize the MCP server
console.error("Initializing local MCP server...");
const server = new Server(
  {
    name: "dynamic-mcp-bridge",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
);

// Cache for tools
let toolsCache = [];
let toolsCacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

var client = new Client({
  name: "local-mcp-bridge",
  version: "1.0.0",
});
var transport = undefined;

// Set up MCP server handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error("Handling tools/list request");
  if (transport === undefined) {
    transport = new StreamableHTTPClientTransport(new URL(TB_MCP_HOST), {
      requestInit: {
        headers: {
          "x-api-key": API_KEY,
        },
      },
    });
    await client.connect(transport);
  }

  console.error("Handling tools/list request");

  try {
    const listToolsResponse = await client.listTools();

    console.error("tools received:", listToolsResponse);

    return { tools: listToolsResponse.tools };
  } catch (error) {
    console.error("error", error);
    return { tools: [] };
  }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    console.error(`Forwarding tool call: ${name}`, args);

    const result = await client.callTool({
      name,
      arguments: args,
    });
    console.error("result was received:", result);

    if (result.isError) {
      console.error("Error executing tool:", result.error);
      return {
        content: [
          {
            type: "text",
            text: `Error executing tool: ${result.error.message}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: result.content,
    };
  } catch (error) {
    console.error(`Tool call failed:`, error.message);
    return {
      content: [
        {
          type: "text",
          text: `Error connecting to dynamic server: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function start() {
  try {
    console.error("Starting server initialization...");
    console.error("Process ID:", process.pid);
    console.error("Parent process ID:", process.ppid);

    // Start the stdio server
    console.error("Starting stdio transport...");
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("Local MCP bridge running");

    // Keep the process alive
    process.stdin.resume();

    // Add keep-alive mechanism
    const keepAliveInterval = setInterval(() => {
      console.error("Keep-alive ping");
    }, 10000); // Ping every 10 seconds

    // Handle process termination
    process.on("SIGINT", () => {
      console.error("Received SIGINT, shutting down gracefully...");
      clearInterval(keepAliveInterval);
      process.exit(0);
    });

    process.on("SIGTERM", (signal) => {
      console.error("Received SIGTERM signal:", signal);
      clearInterval(keepAliveInterval);
      process.exit(0);
    });

    // Log any unhandled errors
    process.on("uncaughtException", (error) => {
      console.error("Uncaught exception:", error);
      console.error("Error stack:", error.stack);
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled rejection at:", promise);
      console.error("Reason:", reason);
    });

    // Keep the process running
    await new Promise(() => {});
  } catch (error) {
    console.error("Failed to start server:", error.message);
    console.error("Error stack:", error.stack);
    process.exit(1);
  }
}

// Run the server
console.error("Starting server...");
start();
