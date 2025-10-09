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
- Removing or renaming MCP tools (e.g., `create_user`, `list_domains`, etc.)
- Changing tool parameter names or types (e.g., renaming `userName` to `userEmail`)
- Changing tool response formats or structures
- Removing support for specific MCP protocol versions
- Changes to required environment variables (`PURELYMAIL_API_KEY`)
- License changes that affect usage rights
- Changes to PurelyMail API integration that affect tool behavior
- Major architectural changes (e.g., v2.0.0 moved from grouped to flat tool structure)

### Examples of Non-Breaking Changes:
- Adding new MCP tools or actions
- Adding optional parameters to existing tools
- Bug fixes that don't change tool behavior
- Documentation updates
- Internal code refactoring
- Performance improvements
- Adding new optional features
- Updating swagger spec without changing tool interfaces

## Release Process

This project uses an automated release process with version management handled by a custom script and GitHub Actions workflow.

### Automated Release (Recommended)

1. **Determine version increment** based on changes made
2. **Update version** using the version script:
   ```bash
   # Interactive mode with gum UI
   npm run version:update 2.0.0           # via npm script
   ./scripts/update-version.sh 2.0.0      # direct script
   nix run .#update-version -- 2.0.0      # via nix
   ```
3. **Script automatically**:
   - Updates `package.json` version
   - Updates `flake.nix` version
   - Shows diff preview
   - Offers to create git tag (optional)
4. **Push tag to trigger release**:
   ```bash
   git push origin v2.0.0
   ```
5. **GitHub Actions workflow automatically**:
   - Verifies version consistency
   - Creates PR if files need syncing
   - Builds and tests the package
   - Publishes to npm

### Manual Release (Advanced)

If you need manual control:

```bash
# 1. Update version across files
./scripts/update-version.sh 2.0.0

# 2. Build and test
npm run build
npm run test:mock

# 3. Publish to npm
npm publish

# 4. Create and push git tag
git tag -a v2.0.0 -m "Release v2.0.0"
git push origin v2.0.0
```

## Version Update Script

The `scripts/update-version.sh` script provides two modes:

### Interactive Mode (Default)
```bash
npm run version:update 2.0.0           # via npm script
./scripts/update-version.sh 2.0.0      # direct script
nix run .#update-version -- 2.0.0      # via nix
```

Features:
- Beautiful gum-based UI with colors
- Shows diff preview before applying
- Confirmation prompts
- Offers to create git tag
- Safe with atomic updates and rollback

### Non-Interactive Mode (Automation)
```bash
./scripts/update-version.sh -y 2.0.0
```

Output:
- `No changes needed` - if version already matches
- Diff output - if changes were made
- Used by GitHub Actions workflow

## GitHub Actions Workflow

The `.github/workflows/publish-npm.yml` workflow automates npm publishing:

**Trigger**: Push a git tag matching version pattern
```bash
git tag v2.0.0
git push origin v2.0.0
```

**Workflow Steps**:
1. Extract version from tag
2. Run version update script in non-interactive mode
3. If files need updating: Create PR with diff
4. If files are in sync: Build, test, and publish to npm

**Conditional Behavior**:
- Version files match tag → Publish to npm immediately
- Version files mismatch → Create PR for manual review

## Pre-Release Versions

For alpha, beta, or release candidate versions:

```bash
# Examples
./scripts/update-version.sh 2.0.0-alpha.1
./scripts/update-version.sh 2.0.0-beta.2
./scripts/update-version.sh 2.0.0-rc.1
```

These follow semantic versioning pre-release format and can be published with:
```bash
git tag v2.0.0-rc.1
git push origin v2.0.0-rc.1
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