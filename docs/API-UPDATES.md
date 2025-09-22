# API Updates

This document explains how to keep the PurelyMail MCP Server synchronized with the latest PurelyMail API specification.

## Automated Updates (Recommended)

The project includes GitHub Actions automation that:
- Automatically checks for API changes twice weekly (Tuesday/Friday)
- Creates pull requests with updated specifications, types, and documentation
- Requires no manual intervention

When a PR is created, review the changes and merge if everything looks correct.

## Manual Updates

### One-Command Complete Workflow

```bash
# Complete API update workflow
npm run update:api
```

This single command will:
1. Download the latest swagger specification from PurelyMail
2. Regenerate TypeScript types from the new specification
3. Update endpoint documentation

### Step-by-Step Workflow

If you prefer more control over the process:

```bash
# 1. Download latest spec
npm run fetch:swagger

# 2. Regenerate TypeScript types
npm run generate:types

# 3. Update documentation
npm run generate:docs
```

### Using Nix

```bash
# Complete update using Nix app
nix run .#update-api
```

## What Gets Updated

When running API updates, the following files are modified:

- `purelymail-api-spec.json` - Latest swagger specification
- `src/types/purelymail-api.ts` - Generated TypeScript types
- `endpoint-descriptions.md` - API endpoint documentation

## Testing After Updates

After updating the API specification:

1. **Test with mocks first**: `npm run test:mock`
2. **Use MCP Inspector**: `npm run inspector` to validate tool registration
3. **Update mock responses**: If new endpoints were added, update `src/mocks/mock-client.ts`
4. **Test with real API**: Only after mocks work properly

## Validation Steps

1. **Check TypeScript compilation**: `npm run build`
2. **Verify tool registration**: Launch MCP Inspector and confirm all tools appear
3. **Test tool schemas**: Validate input/output schemas work correctly
4. **Review changes**: Use `git diff` to review what changed in the specification

## Troubleshooting

### Type Errors After Update

If you encounter TypeScript errors after an API update:

1. Ensure the update completed successfully
2. Check if mock responses need updating to match new types
3. Review the swagger spec for breaking changes

### Missing Endpoints

If expected endpoints are missing after an update:

1. Verify the PurelyMail API documentation
2. Check if the endpoint was moved or renamed
3. Ensure the swagger spec includes the endpoint

### Tool Registration Issues

If tools don't appear in MCP Inspector after an update:

1. Check for TypeScript compilation errors
2. Verify the swagger spec is valid JSON
3. Review the tool generation logic in `src/tools/tool-generator.ts`