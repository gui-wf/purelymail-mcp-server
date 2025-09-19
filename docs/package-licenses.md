# Package License Tracking

⚠️ **IMPORTANT**: Before updating any package version or adding new dependencies, you MUST verify that the new version's license remains compatible with this project's licensing terms. See [CLAUDE.md](../CLAUDE.md) for the complete license checking workflow.

## Current Package Licenses

This document tracks the licenses of all dependencies in this project. All licenses listed below are compatible with our custom non-commercial license.

**Last updated**: 2025-01-19  
**Package.json version**: 1.0.0

### Runtime Dependencies

| Package | Version | License | Compatible | Notes |
|---------|---------|---------|------------|-------|
| `@modelcontextprotocol/sdk` | 0.6.1 | MIT | ✅ | Core MCP SDK from Anthropic |
| `openapi-fetch` | 0.14.0 | MIT | ✅ | Type-safe fetch client |
| `openapi-typescript` | 7.9.1 | MIT | ✅ | OpenAPI to TypeScript generator |

### Development Dependencies

| Package | Version | License | Compatible | Notes |
|---------|---------|---------|------------|-------|
| `@types/node` | 20.19.13 | MIT | ✅ | Node.js type definitions |
| `tsx` | 4.20.5 | MIT | ✅ | TypeScript execution engine |
| `typescript` | 5.9.2 | Apache-2.0 | ✅ | TypeScript compiler |
| `vitest` | 1.6.1 | MIT | ✅ | Testing framework |

## License Compatibility Summary

- **MIT**: Highly permissive, allows commercial use, modification, distribution. Compatible with our restrictive licensing.
- **Apache-2.0**: Permissive open source license, patent grant included. Compatible with our restrictive licensing.

## Updating This Document

When dependencies are updated:

1. **Check license compatibility** using the workflow in [CLAUDE.md](../CLAUDE.md)
2. **Update versions** in the tables above
3. **Update "Last updated" date**
4. **Verify all licenses remain compatible**
5. **Document any license changes** in the Notes column

## Red Flags

🚨 **Immediately escalate if you encounter**:
- GPL licenses (any version) - requires share-alike
- AGPL licenses - requires source disclosure for network use
- Proprietary/Commercial licenses - may conflict with our terms
- "No Commercial Use" clauses - may be redundant but need review
- Any license change from the versions documented above

## Automated Checking

Consider adding to CI/CD:
```bash
# Check for license changes
npm list --depth=0 --json | jq '.dependencies | to_entries[] | {name: .key, version: .value.version}'
```