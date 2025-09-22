# Troubleshooting

This document covers common issues and limitations when using the PurelyMail MCP Server.

## Known Issues & Limitations

### Tool Granularity

**AIDEV-NOTE**: Current tool design groups multiple operations per tool (e.g., `manage_user` handles create/delete/modify). This may be too complex for AI assistants. Consider testing against individual tools per operation if assistants struggle with the `action` parameter pattern.

**Impact**: AI assistants might have difficulty understanding which parameters are required for each action within a tool.

**Workaround**: When using the tools, be explicit about the action you want to perform and provide clear parameter documentation.

### API Limitations

- **Domain ownership verification**: Some operations require domain ownership verification
- **Rate limiting**: Rate limiting may apply (not documented in swagger spec)
- **Irreversible operations**: Certain operations may not be reversible

### Common Development Issues

#### "Cannot find module" Errors

**Symptoms**: TypeScript compilation fails with module resolution errors

**Solutions**:
- Ensure `.js` extension in imports (even for TypeScript files)
- Run `npm run generate:types` if types are missing
- Check that the import path is correct

#### Type Errors After API Changes

**Symptoms**: TypeScript errors after updating API specification

**Solutions**:
1. Run `npm run update:api` to fetch latest spec and regenerate types
2. Update mock implementations to match new types if needed
3. Check if the API introduced breaking changes

#### MCP Inspector Connection Issues

**Symptoms**: MCP Inspector can't connect to the server

**Solutions**:
- Check server is using StdioServerTransport
- Ensure no `console.log` statements (use `console.error` instead)
- Verify tools are properly registered
- Check for TypeScript compilation errors

#### Authentication Issues

**Symptoms**: API calls fail with authentication errors

**Solutions**:
- Verify `PURELYMAIL_API_KEY` environment variable is set
- Check that the API key is valid and active
- Test with mock mode first: `MOCK_MODE=true`

#### Mock Mode Issues

**Symptoms**: Mock responses don't match expected format

**Solutions**:
- Update mock responses in `src/mocks/mock-client.ts`
- Check swagger spec for response schema changes
- Verify mock data follows the expected format

### Performance Issues

#### Slow Tool Registration

**Symptoms**: Long delay when starting the server

**Solutions**:
- Check if swagger spec is being fetched unnecessarily
- Ensure tools are cached after first creation
- Use lazy loading for swagger spec

#### Memory Usage

**Symptoms**: High memory consumption

**Solutions**:
- Check for memory leaks in long-running processes
- Use streaming for large responses when possible
- Monitor tool registration overhead

### Testing Issues

#### Tests Failing in Mock Mode

**Symptoms**: Tests pass with real API but fail in mock mode

**Solutions**:
- Verify mock responses match swagger examples
- Update mock data to include required fields
- Check that mock client implements all required methods

#### Real API Tests Failing

**Symptoms**: Tests fail when using real PurelyMail API

**Solutions**:
- Check API key validity
- Verify network connectivity
- Ensure test data doesn't conflict with existing data
- Check for rate limiting

## Getting Help

### Debug Information Collection

When reporting issues, include:

1. **Environment Information**:
   - Node.js version
   - Operating system
   - MCP client being used

2. **Error Details**:
   - Full error message
   - Stack trace if available
   - Steps to reproduce

3. **Configuration**:
   - MCP client configuration
   - Environment variables (without sensitive values)
   - Mock mode vs real API

### Debug Mode

Enable debug output:

```bash
# Enable MCP protocol debugging
DEBUG=mcp:* npm run dev

# Enable all debug output
DEBUG=* npm run dev
```

### Log Analysis

- Server logs go to stderr (stdout is for MCP protocol)
- Use `console.error()` for debug output, not `console.log()`
- Check both client and server logs when debugging connection issues