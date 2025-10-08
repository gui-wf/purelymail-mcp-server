# Installation Guide

This guide covers different ways to install and use the PurelyMail MCP Server.

## Table of Contents

- [Quick Start with npx](#quick-start-with-npx)
- [Global Installation via npm](#global-installation-via-npm)
- [Local Installation via npm](#local-installation-via-npm)
- [Nix Installation](#nix-installation)
- [From Source](#from-source)
- [Configuration](#configuration)

---

## Quick Start with npx

The fastest way to try the server without installing:

```bash
npx purelymail-mcp-server
```

This will download and run the latest version from npm. **Note**: You need to set the `PURELYMAIL_API_KEY` environment variable first:

```bash
PURELYMAIL_API_KEY="your-api-key" npx purelymail-mcp-server
```

### Using with MCP Clients

For Claude Desktop or other MCP clients, add to your configuration:

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "npx",
      "args": ["purelymail-mcp-server"],
      "env": {
        "PURELYMAIL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

---

## Global Installation via npm

Install globally to use from anywhere:

```bash
npm install -g purelymail-mcp-server
```

Then run directly:

```bash
PURELYMAIL_API_KEY="your-api-key" purelymail-mcp-server
```

### Benefits of Global Installation

- Faster startup (no download on each run)
- Works offline (after initial install)
- Version pinning for consistency

### Updating

```bash
npm update -g purelymail-mcp-server
```

Or reinstall for latest:

```bash
npm uninstall -g purelymail-mcp-server
npm install -g purelymail-mcp-server
```

---

## Local Installation via npm

Install as a project dependency:

```bash
# Create a new project directory
mkdir my-purelymail-project
cd my-purelymail-project

# Initialize package.json
npm init -y

# Install as dependency
npm install purelymail-mcp-server
```

### Run Locally Installed Package

Using npm scripts (recommended):

**package.json:**
```json
{
  "scripts": {
    "start": "purelymail-mcp-server"
  }
}
```

Then run:

```bash
PURELYMAIL_API_KEY="your-api-key" npm start
```

Or use npx to run local install:

```bash
PURELYMAIL_API_KEY="your-api-key" npx purelymail-mcp-server
```

### MCP Configuration for Local Install

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "npx",
      "args": ["purelymail-mcp-server"],
      "env": {
        "PURELYMAIL_API_KEY": "your-api-key-here"
      },
      "cwd": "/path/to/my-purelymail-project"
    }
  }
}
```

---

## Nix Installation

If you use Nix, you can install from the flake.

### Run Directly from GitHub

```bash
nix run github:gui-wf/purelymail-mcp-server
```

### Run with API Key

```bash
PURELYMAIL_API_KEY="your-api-key" nix run github:gui-wf/purelymail-mcp-server
```

### Install to Profile

```bash
nix profile install github:gui-wf/purelymail-mcp-server
```

### MCP Configuration with Nix

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "nix",
      "args": ["run", "github:gui-wf/purelymail-mcp-server"],
      "env": {
        "PURELYMAIL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

---

## From Source

### Prerequisites

- Node.js 20+
- npm
- (Optional) Nix with flakes enabled

### Clone and Build

```bash
# Clone the repository
git clone https://github.com/gui-wf/purelymail-mcp-server.git
cd purelymail-mcp-server

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run the server
PURELYMAIL_API_KEY="your-api-key" npm run dev
```

### Using Nix Development Environment

```bash
# Enter dev shell
nix develop

# Install dependencies
npm install

# Build and run
npm run build
PURELYMAIL_API_KEY="your-api-key" npm run dev
```

### MCP Configuration for Source Install

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "node",
      "args": ["/path/to/purelymail-mcp-server/dist/index.js"],
      "env": {
        "PURELYMAIL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Or with Nix:

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "nix",
      "args": ["run", "/path/to/purelymail-mcp-server#default"],
      "env": {
        "PURELYMAIL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

---

## Configuration

### Environment Variables

- **`PURELYMAIL_API_KEY`** (required): Your PurelyMail API key
- **`MOCK_MODE`** (optional): Set to `true` to run in mock mode without real API calls

### Mock Mode

For testing and development without a PurelyMail account:

```bash
MOCK_MODE=true npx purelymail-mcp-server
```

Or with the MCP Inspector:

```bash
MOCK_MODE=true npx @modelcontextprotocol/inspector npx purelymail-mcp-server
```

### Claude Desktop Configuration

The configuration file location varies by OS:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Edit the file and add the purelymail server configuration as shown in the examples above.

### Claude Code Configuration

For Claude Code, create a `.mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "npx",
      "args": ["purelymail-mcp-server"],
      "env": {
        "PURELYMAIL_API_KEY": "${PURELYMAIL_API_KEY}"
      }
    }
  }
}
```

Then set your API key as an environment variable:

```bash
export PURELYMAIL_API_KEY="your-api-key-here"
```

---

## Verifying Installation

After installation, verify the server works:

```bash
# Test with mock mode
MOCK_MODE=true npx purelymail-mcp-server
```

You should see output like:

```
Running in MOCK MODE - using test responses
Running in MOCK MODE - using swagger examples
Registered 19 tools from swagger spec
```

Press `Ctrl+C` to stop the server.

---

## Troubleshooting

### Command not found

If `purelymail-mcp-server` is not found after global install:

```bash
# Check if npm global bin is in PATH
npm bin -g

# Add to PATH if needed (add to your shell rc file)
export PATH="$(npm bin -g):$PATH"
```

### API Key Issues

Make sure your API key is correct:

```bash
# Test with echo
echo $PURELYMAIL_API_KEY
```

If empty, set it:

```bash
export PURELYMAIL_API_KEY="your-api-key-here"
```

### MCP Client Not Connecting

1. Check the server runs standalone: `MOCK_MODE=true npx purelymail-mcp-server`
2. Verify JSON configuration syntax
3. Check logs in your MCP client
4. Try absolute paths instead of `npx`

---

## Next Steps

- Read the [Development Guide](DEVELOPMENT.md) for contributing
- Check [Troubleshooting Guide](TROUBLESHOOTING.md) for common issues
- Review the [API Updates](API-UPDATES.md) documentation

---

## Support

- **Issues**: https://github.com/gui-wf/purelymail-mcp-server/issues
- **Discussions**: https://github.com/gui-wf/purelymail-mcp-server/discussions
