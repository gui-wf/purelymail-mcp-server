# Versioning Guidelines

This project follows [Semantic Versioning (SemVer)](https://semver.org/) for all releases to npm registry.

## Semantic Versioning Overview

To keep the JavaScript ecosystem healthy, reliable, and secure, every time you make significant updates to this npm package, publish a new version with an updated version number in `package.json` that follows the semantic versioning spec.

Following semantic versioning helps other developers who depend on your code understand the extent of changes in a given version, and adjust their own code if necessary.

## Version Increment Rules

| Code Status | Stage | Rule | Example Version |
|-------------|-------|------|-----------------|
| First release | New product | Start with 1.0.0 | 1.0.0 |
| Backward compatible bug fixes | Patch release | Increment the third digit | 1.0.1 |
| Backward compatible new features | Minor release | Increment the middle digit and reset last digit to zero | 1.1.0 |
| Changes that break backward compatibility | Major release | Increment the first digit and reset middle and last digits to zero | 2.0.0 |

## Breaking Changes for This Project

⚠️ **Important**: If you introduce a change that breaks a package dependency or changes the MCP server interface, **strongly increment the version major number**.

### Examples of Breaking Changes for Your MCP Server:
- Removing or renaming MCP tools (`manage_user`, `manage_domains`, etc.)
- Changing tool parameter names or types (e.g., renaming `userName` to `userEmail`)
- Changing tool response formats or structures
- Removing support for specific MCP protocol versions
- Changes to required environment variables (`PURELYMAIL_API_KEY`)
- License changes that affect usage rights
- Changes to PurelyMail API integration that affect tool behavior

### Examples of Non-Breaking Changes:
- Adding new MCP tools or actions
- Adding optional parameters to existing tools
- Bug fixes that don't change tool behavior
- Documentation updates
- Internal code refactoring
- Performance improvements
- Adding new optional features
- Updating swagger spec without changing tool interfaces

## Your Release Process

1. **Determine version increment** based on changes made
2. **Update package.json version** using `npm version [patch|minor|major]`
3. **Update docs/package-licenses.md** if dependencies changed
4. **Test thoroughly** with MCP Inspector and real PurelyMail API
5. **Run license checks** using `/check-license` for any new dependencies
6. **Commit version bump** with clear changelog
7. **Publish to npm** using `npm publish`
8. **Tag release** on GitHub with changelog

## Version Commands

```bash
# Patch release (1.0.0 → 1.0.1) - bug fixes
npm version patch

# Minor release (1.0.0 → 1.1.0) - new features, backward compatible
npm version minor

# Major release (1.0.0 → 2.0.0) - breaking changes
npm version major

# Publish to npm
npm publish
```

## Changelog Maintenance

For each release, document in your commit messages and GitHub releases:
- **Added**: New MCP tools, PurelyMail API endpoints, features
- **Changed**: Changes in existing tool functionality
- **Deprecated**: Soon-to-be removed tools or parameters
- **Removed**: Tools or features removed in this version
- **Fixed**: Bug fixes in MCP server or API integration
- **Security**: Security vulnerability fixes

This ensures users of your MCP server can understand the impact of upgrading to a new version and plan their integrations accordingly.