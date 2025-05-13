#!/usr/bin/env node
import * as fs from "fs";
import { homedir } from "os";

// Parse the --tollbit-api-key parameter
function parseArgs(args: string[]): {
  tollbitApiKey?: string;
  toolboxId?: string;
} {
  const result: { tollbitApiKey?: string; toolboxId?: string } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--api-key") {
      if (i + 1 < args.length) {
        result.tollbitApiKey = args[i + 1];
        i++; // Skip the value
      } else {
        throw new Error("Error: --api-key parameter requires a value.");
      }
    } else if (args[i] === "--toolbox-id") {
      if (i + 1 < args.length) {
        result.toolboxId = args[i + 1];
        i++; // Skip the value
      } else {
        throw new Error("Error: --toolbox-id parameter requires a value.");
      }
    } else {
      throw new Error(`Unknown parameter passed: ${args[i]}`);
    }
  }
  return result;
}

const CLAUDE_DESKTOP_CONFIG = `${homedir()}/Library/Application Support/Claude/claude_desktop_config.json`;

try {
  const args = process.argv.slice(2); // Skip the first two arguments (node and script path)
  const { tollbitApiKey, toolboxId } = parseArgs(args);

  // Check if the API key was provided
  if (!tollbitApiKey) {
    throw new Error("Error: --api-key parameter is required.");
  }

  var fileData = null;
  try {
    fileData = fs.readFileSync(CLAUDE_DESKTOP_CONFIG, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn(
        `WARN: claude_desktop_config.json file not found. Initializing the file at ${CLAUDE_DESKTOP_CONFIG}.`
      );
    }

    fileData = JSON.stringify({});
  }
  // const fileData = fs.readFileSync(CLAUDE_DESKTOP_CONFIG, "utf-8");
  const config = JSON.parse(fileData);

  if (config.hasOwnProperty("mcpServers")) {
    const servers = config["mcpServers"] || {};

    if (servers.hasOwnProperty("@tollbit/mcp-toolbox")) {
      console.log(
        'Found existing "@tollbit/mcp-toolbox" server configuration. Updating API key'
      );

      const existingServer = servers["@tollbit/mcp-toolbox"];
      existingServer["args"] = [
        "-y",
        "@tollbit/mcp-toolbox",
        "--api-key",
        `${tollbitApiKey}`,
        ...(toolboxId ? ["--toolbox-id", `${toolboxId}`] : []),
      ];
    } else {
      console.log("Adding new server configuration for @tollbit/mcp-toolbox");

      servers["@tollbit/mcp-toolbox"] = {
        command: "npx",
        args: ["-y", "@tollbit/mcp-toolbox", "--api-key", `${tollbitApiKey}`],
      };
      config["mcpServers"] = servers;
    }
  } else {
    console.log(
      "Adding mcpServers block with @tollbit/mcp-toolbox configuration"
    );
    config["mcpServers"] = {
      "@tollbit/mcp-toolbox": {
        command: "npx",
        args: ["-y", "@tollbit/mcp-toolbox", "--api-key", `${tollbitApiKey}`],
      },
    };
  }

  const newFileData = JSON.stringify(config, null, 2);

  fs.writeFileSync(
    `${homedir()}/Library/Application Support/Claude/claude_desktop_config.json`,
    newFileData
  );
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
