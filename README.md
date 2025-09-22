# PurelyMail MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to PurelyMail's email management API.

## Features

- **Type-Safe API Integration**: Generated TypeScript client from PurelyMail's swagger specification
- **Comprehensive Tool Coverage**: Manage users, domains, routing rules, billing, and password reset methods
- **Mock Development Mode**: Test and develop safely without touching real data
- **Resource-Grouped Tools**: Intelligent organization of API endpoints into logical tools
- **Error Handling**: Robust error reporting and validation

## Quick Start

### 1. Prerequisites

- Node.js 20+ (if installing from source)
- PurelyMail API key (for production use)
- Nix (for reproducible development environment - source only)

### 2. Testing with Mock Data

```bash
# Run in mock mode (no API key required)
MOCK_MODE=true npm run dev

# Test with MCP Inspector
MOCK_MODE=true npm run inspector
```

### 3. Production Setup

```bash
# Set your PurelyMail API key
export PURELYMAIL_API_KEY="your-api-key-here"

# Run the server
npm run dev

# Or build and run
npm run build
node dist/index.js
```

## MCP Integration

### Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

#### When installed via npm:

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

#### Using Nix flake from GitHub:

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

#### When using from source with Nix:

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

#### When using from source with Node.js:

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

### Claude Code

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

### Other MCP Clients

The server uses stdio transport and follows the MCP specification, making it compatible with any MCP-compliant client.

## Available Tools

The server provides 4 main tools grouped by resource:

### `manage_user`
- **Actions**: Create User, Delete User, List Users, Modify User, Get User, Create App Password, Delete App Password
- **Use for**: Managing email users and their settings

### `manage_domains`
- **Actions**: Add Domain, List Domains, Update Domain Settings, Delete Domain, Get Ownership Code
- **Use for**: Managing email domains and DNS settings

### `manage_routing`
- **Actions**: Create Routing Rule, Delete Routing Rule, List Routing Rules
- **Use for**: Setting up email forwarding and routing

### `manage_billing`
- **Actions**: Check Account Credit
- **Use for**: Monitoring account balance and usage

### `manage_user_password_reset`
- **Actions**: Create/Update Password Reset Method, Delete Password Reset Method, List Password Reset Methods
- **Use for**: Managing user password recovery options

## Features

- **Type-Safe API Integration**: Generated TypeScript client from PurelyMail's swagger specification
- **Comprehensive Tool Coverage**: Manage users, domains, routing rules, billing, and password reset methods
- **Mock Development Mode**: Test and develop safely without touching real data
- **Resource-Grouped Tools**: Intelligent organization of API endpoints into logical tools
- **Error Handling**: Robust error reporting and validation

## Installation

### Via npm (Recommended)
```bash
npm install -g purelymail-mcp-server
```

### Via npx (No Installation)
```bash
npx purelymail-mcp-server
```

### From Source
```bash
# Clone and setup
git clone https://github.com/gui-wf/purelymail-mcp-server.git
cd purelymail-mcp-server

# Using Nix (recommended)
nix develop

# Or use npm directly
npm install

# Build the TypeScript project
npm run build
```



## Tool Usage Patterns

### Example: Creating a User

```json
{
  "tool": "manage_user",
  "arguments": {
    "action": "Create User",
    "userName": "john",
    "domainName": "example.com",
    "password": "secure-password",
    "enableSearchIndexing": true,
    "sendWelcomeEmail": true
  }
}
```

### Example: Listing Domains

```json
{
  "tool": "manage_domains",
  "arguments": {
    "action": "List Domains",
    "includeShared": false
  }
}
```

## Architecture Notes

### Type Safety
- All API interactions use generated TypeScript types
- Zero manual type definitions - everything derives from swagger spec
- Automatic validation and error handling

### Mock vs Real API
- Mock mode uses swagger response examples when available
- Fallback to sensible defaults for missing examples
- Same interface for both modes ensures consistent behavior

### Error Handling
- Structured error responses with context
- API errors are wrapped and formatted for AI consumption
- Network and validation errors are handled gracefully


## Documentation

See `docs/` for project documentation:
- [Development Guide](docs/DEVELOPMENT.md) - Development workflow and contributing guidelines
- [API Updates](docs/API-UPDATES.md) - Keeping the server synchronized with PurelyMail API changes
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and solutions

## License

This project is licensed under a custom non-commercial license - see the [LICENSE](LICENSE) file for details.

### Commercial Use
This software is available for non-commercial use only. For commercial licensing, please contact fairuse@gui.wf.

### Dependencies
This project uses MIT and Apache-2.0 licensed dependencies. See docs/package-licenses.md for full dependency licensing information.
