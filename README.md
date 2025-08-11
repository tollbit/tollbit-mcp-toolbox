# MCP Toolbox

[![Docs](https://img.shields.io/badge/Read%20the-Docs-black.svg)](https://docs.tollbit.dev/quickstart/applications)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tollbit/mcp-toolbox)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/ZB4mEKDRm4)

A stdio Model Context Protocol (MCP) server that bridges Tollbit's Dynamic Toolbox to stdio-based MCP clients.

### Why Use This?
- **Plug-and-play for MCP clients**: Works out-of-the-box with clients that expect stdio MCP servers (e.g., Claude Desktop).
- **Dynamic tools from the cloud**: Tools are fetched and executed via Tollbit’s backend; nothing to install locally.
- **Simple and secure**: Authenticate with an API key and optionally target a specific toolbox with `--toolbox-id`.

### Installation
No install required to run:

```bash
npx @tollbit/mcp-toolbox --api-key <your_api_key>
```

### Quick Start
- **Run the bridge locally (any MCP stdio client):**

```bash
npx @tollbit/mcp-toolbox --api-key <your_api_key> [--toolbox-id <id>]
```

Optional host override:

```bash
TB_MCP_HOST=https://mcp.tollbit.dev/ npx @tollbit/mcp-toolbox --api-key <your_api_key>
```

- **Claude Desktop (macOS) one-liner:**

```bash
npx -y @tollbit/mcp-toolbox install_claude --api-key <your_api_key> [--toolbox-id <id>]
```

This adds `@tollbit/mcp-toolbox` to Claude Desktop's `claude_desktop_config.json` with your API key.

### Key Features
- **Stdio MCP bridge** that proxies `tools/list` and `tools/call` to Tollbit's dynamic server.
- **Claude-safe tool names**: Sanitizes tool names to alphanumeric/underscore for compatibility.
- **Streaming HTTP transport** with API key auth.
- **Keep-alive and graceful shutdown** for reliability.
- **macOS installer for Claude Desktop** configuration.

### CLI Options
- `--api-key` (required): Your Tollbit API key (get it from the developer portal).
- `--toolbox-id` (optional): ID of the toolbox to use. Defaults to `mcp`.

### Environment Variables
- `TB_MCP_HOST` (optional): Base URL for the dynamic MCP server. Default: `https://mcp.tollbit.dev/`

### Documentation
- **Full Documentation**: https://docs.tollbit.dev/quickstart/applications
- **API Reference**: See the Model Context Protocol specification and the code in `src/`.
- **Examples**: Quickstart commands above; more examples in the docs.

### Common Use Cases
- **Claude Desktop integration**: Quickly add a dynamic MCP server using the `install_claude` script.
- **Custom MCP client bridge**: Use as a stdio server process to access Tollbit-hosted tools.
- **Multi-toolbox workflows**: Switch contexts with `--toolbox-id` to test or target different tool sets.

### Requirements
- **Node.js**: 18+ recommended (ESM, top-level `import` support).
- **macOS**: Required only for the `install_claude` helper script.
- **Tollbit API key**: Obtain from the developer portal at https://hack.tollb.it/
- **Network access** to `TB_MCP_HOST` (default `https://mcp.tollbit.dev/`).

### Support
- **Community**: Join us on Discord: https://discord.gg/ZB4mEKDRm4
- **Issues**: Report bugs or request features on GitHub Issues: https://github.com/tollbit/mcp-toolbox/issues
- **Discussions**: Ask questions or share ideas: https://github.com/tollbit/mcp-toolbox/discussions

### License
MIT
