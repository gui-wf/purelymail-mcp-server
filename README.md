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

- Node.js 20+
- PurelyMail API key (for production use)
- Nix (for reproducible development environment)

### 2. Installation

```bash
# Clone and setup
git clone <repository-url>
cd purelymail-mcp-server

# Using Nix (recommended)
nix develop

# Or use npm directly
npm install

# Generate TypeScript client
npm run generate:client
```

### 3. Testing with Mock Data

```bash
# Run in mock mode (no API key required)
MOCK_MODE=true npm run dev

# Test with MCP Inspector
MOCK_MODE=true npm run inspector
```

### 4. Production Setup

```bash
# Set your PurelyMail API key
export PURELYMAIL_API_KEY="your-api-key-here"

# Run the server
npm run dev

# Or build and run
npm run build
node dist/index.js
```

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

## Claude Desktop Integration

Add to your Claude Desktop configuration:

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

Or if not using Nix:

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

## Documentation

See `docs/` for project documentation including license tracking and known issues.

## Development

### Project Structure

```
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/
│   │   └── tool-generator.ts # Automatic tool generation from swagger
│   └── mocks/
│       └── mock-client.ts    # Mock API implementation
├── .claude/commands/         # Claude Code automation commands
├── docs/                     # Project documentation
├── generated-client/         # Auto-generated TypeScript client
├── scripts/
│   └── extract-endpoints.js  # Documentation generation
├── purelymail-api-spec.json  # Extracted swagger specification
└── endpoint-descriptions.md  # Generated API documentation
```

### Available Scripts

```bash
npm run fetch:swagger    # Download latest API spec from PurelyMail
npm run generate:types   # Regenerate TypeScript types from spec
npm run generate:docs    # Update endpoint documentation
npm run update:api       # Complete API update workflow
npm run build           # Compile TypeScript
npm run dev             # Run server in development mode
npm run test:mock       # Test with mock data
npm run inspector       # Launch MCP Inspector
```

### API Updates

**Automated (Recommended):**
- GitHub Actions automatically checks for API changes twice weekly
- Creates pull requests with updated specifications, types, and documentation
- No manual intervention required

**Manual Updates:**
```bash
# One-Command Complete update workflow
npm run update:api

  # OR step by step:
  npm run fetch:swagger    # Download latest spec
  npm run generate:types   # Regenerate TypeScript types
  npm run generate:docs    # Update documentation

# Using Nix
nix run .#update-api
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

## Known Issues & Limitations

### Tool Granularity
**AIDEV-NOTE**: Current tool design groups multiple operations per tool (e.g., `manage_user` handles create/delete/modify). This may be too complex for AI assistants. Consider testing against individual tools per operation if assistants struggle with the `action` parameter pattern.

### API Limitations
- Some operations require domain ownership verification
- Rate limiting may apply (not documented in swagger spec)
- Certain operations may not be reversible

## Contributing

1. Ensure all changes maintain type safety
2. Update mock responses when adding new endpoints
3. Test with both mock and real API modes
4. Run `npm run build` to verify TypeScript compilation
5. Use MCP Inspector to validate tool registration

## Security

- Never commit API keys to version control
- Use environment variables for sensitive configuration
- Mock mode is safe for development and testing
- Review all changes to generated client code

## License

This project is licensed under a custom non-commercial license - see the [LICENSE](LICENSE) file for details.

### Commercial Use
This software is available for non-commercial use only. For commercial licensing, please contact fairuse@gui.wf.

### Dependencies
This project uses MIT and Apache-2.0 licensed dependencies. See docs/package-licenses.md for full dependency licensing information.
