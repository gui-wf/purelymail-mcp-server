# Development Guide

## Project Structure

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

## Available Scripts

```bash
# Development and Testing
npm run dev             # Run MCP server with stdio transport (for MCP clients)
npm run test            # Run tests with vitest
npm run test:mock       # Run tests in mock mode
npm run inspector       # Launch MCP Inspector with mock data
npm run build           # Compile TypeScript to dist/

# API Management
npm run fetch:swagger    # Download latest API spec from PurelyMail
npm run generate:types   # Regenerate TypeScript types from spec
npm run generate:docs    # Update endpoint documentation
npm run update:api       # Complete API update workflow (fetch + generate + docs)

# Version Management
npm run version:update 2.0.0            # Update version (npm script)
./scripts/update-version.sh 2.0.0       # Update version (direct script)
./scripts/update-version.sh -y 2.0.0    # Update version (non-interactive)
nix run .#update-version -- 2.0.0       # Update version via Nix
```

**Key points:**
- **`npm run dev`** starts the MCP server with stdio transport - this is what MCP clients connect to
- **`npm run inspector`** launches the MCP Inspector for interactive testing
- **`npm run build`** compiles TypeScript for production use
- **`npm run update:api`** updates all API-related files when PurelyMail API changes

## Tool Usage Patterns

As of v2.0+, the server uses a flat tool structure with one tool per operation.

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

## Contributing Guidelines

1. **Maintain Type Safety**: Ensure all changes maintain TypeScript type safety
2. **Update Mock Responses**: When adding new endpoints, update mock responses in `mock-client.ts`
3. **Test Thoroughly**: Test with both mock and real API modes
4. **Verify Build**: Run `npm run build` to verify TypeScript compilation
5. **Validate Tools**: Use MCP Inspector to validate tool registration

## Development Workflow

### Setting Up Development Environment

```bash
# Using Nix (recommended)
nix develop

# Or use npm directly
npm install
```

### Testing Changes

1. **Start with mocks**: `npm run test:mock`
2. **Use MCP Inspector**: `npm run inspector` for interactive testing
3. **Test tool registration**: Verify all tools appear correctly
4. **Real API testing**: Only after mocks work properly

### Adding New Features

1. **Check API spec**: Ensure the PurelyMail API supports the feature
2. **Update types**: Run `npm run generate:types` if API spec changed
3. **Implement feature**: Tools are auto-generated from OpenAPI spec
4. **Add mock responses**: Update `mock-client.ts` with example responses
5. **Test thoroughly**: Use both mock and real API modes
6. **Update documentation**: Update relevant docs and README if needed

### Releasing New Versions

See `docs/versioning-guidelines.md` for complete release process. Quick summary:

1. **Update version**:
   ```bash
   npm run version:update 2.0.0
   # or: ./scripts/update-version.sh 2.0.0
   # or: nix run .#update-version -- 2.0.0
   ```
2. **Push tag** (triggers automated release):
   ```bash
   git push origin v2.0.0
   ```
3. **GitHub Actions** automatically publishes to npm

The version script updates both `package.json` and `flake.nix`, shows a diff preview, and offers to create a git tag.