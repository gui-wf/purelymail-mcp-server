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

## Development

### Project Structure

```
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/
│   │   └── tool-generator.ts # Automatic tool generation from swagger
│   └── mocks/
│       └── mock-client.ts    # Mock API implementation
├── generated-client/         # Auto-generated TypeScript client
├── scripts/
│   └── extract-endpoints.js  # Documentation generation
├── purelymail-api-spec.json  # Extracted swagger specification
└── endpoint-descriptions.md  # Generated API documentation
```

### Available Scripts

```bash
npm run generate:client  # Regenerate TypeScript client from swagger
npm run generate:docs    # Update endpoint documentation
npm run build           # Compile TypeScript
npm run dev             # Run server in development mode
npm run test:mock       # Test with mock data
npm run inspector       # Launch MCP Inspector
```

### Regenerating from Updated API

When PurelyMail updates their API:

1. Download new swagger-spec.js from https://news.purelymail.com/api/swagger-spec.js
2. Run `npm run generate:client` to update TypeScript types
3. Run `npm run generate:docs` to update documentation
4. Test with `MOCK_MODE=true npm run inspector`

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

AIDEV-TODO: Specify License - Research about which License aligns more with my values and what I want for this Project

[Specify your license here]
