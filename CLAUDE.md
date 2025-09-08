Guidance on working with this PurelyMail MCP Server project.

## Project Overview
MCP (Model Context Protocol) server for PurelyMail email service. Exposes PurelyMail's API as tools for AI assistants using TypeScript and swagger-codegen for type safety.

## Tech Stack
- **Runtime**: Node.js 20 on Nix
- **Language**: TypeScript 5.3+ with ES modules
- **MCP SDK**: @modelcontextprotocol/sdk 0.6+
- **API Client**: openapi-fetch with openapi-typescript (lightweight, type-safe)
- **Package Manager**: npm
- **Testing**: Vitest
- **Environment**: Nix flakes for reproducible builds

## Critical Files
- `swagger-spec.js` - Original PurelyMail swagger spec (fetched from https://news.purelymail.com/api/swagger-spec.js as of September 7, 2025)
- `purelymail-api-spec.json` - Swagger specification (source of truth)
- `endpoint-descriptions.md` - Generated endpoint documentation
- `src/types/purelymail-api.ts` - Generated TypeScript types (DO NOT EDIT - regenerated from swagger)
- `flake.nix` - Nix environment and dependencies
- `.mcp.json` - Claude Code MCP client configuration

## Known Issues

See `KNOWN_ISSUES.md` for detailed documentation of current limitations and workarounds.

## Commands
```bash
# Development
nix develop              # Enter dev environment
npm run generate:types   # Regenerate TypeScript types from swagger
npm run generate:docs    # Update endpoint-descriptions.md
npm run dev             # Run server in development mode
npm run test:mock       # Test with mock data
npm run inspector       # Launch MCP Inspector

# Building
nix build              # Build production package
npm run build          # Compile TypeScript only
```

## Code Conventions

### TypeScript
- Use ES module imports (`import/export`), NOT CommonJS
- Explicit return types for all functions
- Prefer interfaces over type aliases for objects
- Use `.js` extensions in imports (even for TS files)

### File Structure
```
src/
  index.ts              # Entry point - minimal logic
  tools/
    tool-generator.ts   # Generates tools from swagger
  mocks/
    mock-client.ts     # Mock implementation
  tests/
    *.test.ts          # Vitest tests
generated-client/       # DO NOT MODIFY - codegen output
```

### Error Handling
- Never throw raw strings - use Error objects
- Include operation context in errors: `new Error(\`Failed to ${action}: ${details}\`)`
- Log errors to stderr, not stdout (stdout is for MCP protocol)

## Development Workflow

### Adding New Endpoints
1. Update `purelymail-api-spec.json` with new endpoints
2. Run `npm run generate:types` to regenerate TypeScript types
3. Run `npm run generate:docs` to update documentation
4. Test with `MOCK_MODE=true npm run inspector`
5. Implement mock responses in `mock-client.ts`
6. Test with real API

### Testing Changes
1. Always test with mocks first: `npm run test:mock`
2. Use MCP Inspector to validate tool registration
3. Test each tool's input/output schema
4. Only test with real API after mocks work

### Debugging
- Use `console.error()` for debug output (NOT console.log)
- Set `DEBUG=mcp:*` for protocol debugging
- Check `generated-client/` for actual API method signatures

## API Integration Rules

### Authentication
- API key from `PURELYMAIL_API_KEY` environment variable (use `${PURELYMAIL_API_KEY}` syntax in `.mcp.json`)
- Never commit API keys
- Support both mock and real modes

### Tool Design
- Group related endpoints into single tools
- Use swagger operationId as action names
- Extract descriptions from swagger summary/description
- Validate inputs with Zod schemas generated from swagger

### Mock Mode
- Enabled with `MOCK_MODE=true`
- Use swagger response examples when available
- Fall back to sensible defaults
- Log "Running in MOCK MODE" to stderr

## Common Issues

### "Cannot find module"
- Ensure `.js` extension in imports
- Run `npm run generate:types` if types are missing

### Type errors after API change
- Regenerate types: `npm run generate:types`
- Update mock implementations to match new types

### MCP Inspector can't connect
- Check server is using StdioServerTransport
- Ensure no console.log statements (use console.error)
- Verify tools are properly registered

## Git Workflow
- Never commit `generated-client/` if it can be regenerated
- Always commit `purelymail-api-spec.json` changes
- Update `endpoint-descriptions.md` when spec changes
- Test with mocks before pushing

## Performance Considerations
- Lazy load swagger spec only when needed
- Cache generated tools after first creation
- Use streaming for large responses when possible

## Security
- Validate all inputs against swagger schemas
- Sanitize error messages (no sensitive data)
- Use type-safe generated client methods
- Never expose raw API responses without validation
