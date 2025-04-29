# MCP Toolbox

[![Docs](https://img.shields.io/badge/Read%20the-Docs-black.svg)](https://docs.tollbit.dev/quickstart/applications)
[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tollbit/mcp-toolbox)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/ZB4mEKDRm4)

This package provides a stdio MCP server that integrates with tollbit's backend.
This package can be used to integrate the Dynamic Toolbox into clients that expect standard IO servers.

To run the server, use the command:

```
npx @tollbit/mcp-toolbox --api-key <your_api_key>
```

For more details on usage, please see our docs: https://docs.tollbit.dev/quickstart/applications

### Command Line Arguments

- `--api-key` **(required)**: your API key, which you can find in our [developer portal](https://hack.tollb.it/)

### Environment Variables

- `TB_MCP_HOST` _(optional)_: an optional URL for the host MCP server (default: https://mcp.tollbit.dev/mcp)

### Easy Installation for Apps

To support stress free installations, you can use our preconfigured install scripts.

#### Claude Desktop

```
npx -p @tollbit/mcp-toolbox install_claude --api-key <your_api_key>
```
