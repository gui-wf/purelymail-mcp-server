# Known Issues

## Tool Granularity Problem

**Problem**: Current tool design groups multiple operations per tool (e.g., `manage_user` handles Create User, Delete User, Get User, etc.). This creates parameter name conflicts and confusing schemas for AI assistants.

**Example**: The `manage_user` tool schema includes both `userName` (used by most operations) and `userHandle` (used only by Create App Password), making it unclear which parameter to use for specific operations.

**Impact**: AI assistants may use wrong parameter names (e.g., `userHandle` instead of `userName` for Get User), causing "Request could not be parsed" errors.

**Potential Solutions**:
1. **One tool per operation**: Create individual tools like `create_user`, `delete_user`, `get_user` instead of grouped tools
2. **Operation-specific schemas**: Generate different input schemas per action within grouped tools
3. **Better parameter documentation**: Add operation-specific parameter requirements to descriptions

**Current Workaround**: Users must know the correct parameter names for each operation (documented in swagger spec).

## Parameter Name Inconsistencies in PurelyMail API

**Problem**: The PurelyMail API uses inconsistent parameter names across different endpoints:
- Most user operations expect `userName` (e.g., Get User, Delete User, Modify User)
- Create App Password operation expects `userHandle`
- Both refer to the same concept: full email address like "user@domain.com"

**Impact**: When tools combine multiple endpoints, both parameter names appear in the schema, causing confusion about which to use.

**Root Cause**: This appears to be an API design inconsistency in the original PurelyMail swagger specification.

**Affected Operations**:
- Get User: expects `userName`
- Create App Password: expects `userHandle`
- All other user operations: expect `userName`

**Workaround**: Always use `userName` except for Create App Password operation.
