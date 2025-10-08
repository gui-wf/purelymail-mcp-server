# Known Issues

## ✅ RESOLVED: Tool Granularity Problem (v2.0+)

**Status**: **RESOLVED** in v2.0 with new one-tool-per-operation architecture

**Previous Problem**: Earlier versions grouped multiple operations per tool (e.g., `manage_user` handled Create User, Delete User, Get User, etc.). This created parameter name conflicts and confusing schemas for AI assistants.

**Solution Implemented**: As of v2.0, the server uses a flat tool structure where each OpenAPI operation maps to a dedicated MCP tool:
- ✅ One tool per operation (e.g., `create_user`, `delete_user`, `get_user`)
- ✅ Each tool has operation-specific parameters only
- ✅ No parameter conflicts - tool name directly indicates the action
- ✅ Clear, unambiguous schemas for AI assistants

**Example**: Instead of `manage_user` with an `action` parameter and merged parameters from all user operations, you now have:
- `create_user` - only the parameters needed for creating users
- `get_user` - only the parameters needed for retrieving user info
- `delete_user` - only the parameters needed for deleting users
- etc.

This eliminates confusion about which parameters to use for which operation.

---

## Parameter Name Inconsistencies in PurelyMail API

**Problem**: The PurelyMail API uses inconsistent parameter names across different endpoints:
- Most user operations expect `userName` (e.g., Get User, Delete User, Modify User)
- Create App Password operation expects `userHandle`
- Both refer to the same concept: full email address like "user@domain.com"

**Impact**: With the new one-tool-per-operation architecture (v2.0+), this inconsistency is isolated to specific tools and clearly documented in each tool's schema.

**Root Cause**: This appears to be an API design inconsistency in the original PurelyMail swagger specification.

**Affected Operations**:
- `get_user`: expects `userName`
- `create_app_password`: expects `userHandle`
- All other user operations: expect `userName`

**Workaround**: The MCP tools reflect the exact parameter names from the PurelyMail API. AI assistants can see the correct parameter name in each tool's schema. Always use `userName` except for the `create_app_password` tool which uses `userHandle`.
