# PurelyMail MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to PurelyMail's email management API.

## Usage

**Run with npx (no installation needed):**

```bash
npx -y purelymail-mcp-server
```

**Or use Nix (via GitHub flake):**

```bash
nix run github:gui-wf/purelymail-mcp-server --quiet --refresh
```

**Configure in your MCP client:**

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "npx",
      "args": ["-y", "purelymail-mcp-server"],
      "env": {
        "PURELYMAIL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

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

#### Using npx (recommended - no installation):

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "npx",
      "args": ["-y", "purelymail-mcp-server"],
      "env": {
        "PURELYMAIL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Using Nix from GitHub:

```json
{
  "mcpServers": {
    "purelymail": {
      "command": "nix",
      "args": ["run", "github:gui-wf/purelymail-mcp-server", "--quiet", "--refresh"],
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
      "args": ["-y", "purelymail-mcp-server"],
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

The server provides 19 individual tools, each corresponding to a specific PurelyMail API operation:

### User Management
- `create_user` - Create a new email user
- `delete_user` - Delete an email user
- `list_users` - List all users under your account
- `modify_user` - Modify user settings
- `get_user` - Retrieve user details
- `create_app_password` - Create an app-specific password
- `delete_app_password` - Delete an app password

### Password Reset Management
- `create_or_update_password_reset_method` - Create or update password reset method
- `delete_password_reset_method` - Delete a password reset method
- `list_password_reset_methods` - List all password reset methods for a user

### Domain Management
- `add_domain` - Add a new domain
- `list_domains` - List all domains
- `update_domain_settings` - Update domain settings
- `delete_domain` - Delete a domain
- `get_ownership_code` - Get DNS ownership verification code

### Routing Management
- `create_routing_rule` - Create a new routing rule
- `delete_routing_rule` - Delete a routing rule
- `list_routing_rules` - List all routing rules

### Billing
- `check_account_credit` - Check current account credit balance

## Features

- **Type-Safe API Integration**: Generated TypeScript client from PurelyMail's swagger specification
- **Comprehensive Tool Coverage**: Manage users, domains, routing rules, billing, and password reset methods
- **Mock Development Mode**: Test and develop safely without touching real data
- **Resource-Grouped Tools**: Intelligent organization of API endpoints into logical tools
- **Error Handling**: Robust error reporting and validation

## Installation

### Via npx (Recommended - No Installation)
```bash
npx -y purelymail-mcp-server
```

### Via Nix (GitHub Flake)
```bash
nix run github:gui-wf/purelymail-mcp-server --quiet --refresh
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
  "tool": "create_user",
  "arguments": {
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
  "tool": "list_domains",
  "arguments": {
    "includeShared": false
  }
}
```

### Example: Getting User Details

```json
{
  "tool": "get_user",
  "arguments": {
    "userName": "john@example.com"
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
