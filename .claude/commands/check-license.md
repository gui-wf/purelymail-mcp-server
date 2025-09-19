---
argument-hint: [package-name] [version-optional]
description: Check if a package license is compatible with our non-commercial license
---

Check the license compatibility for package $1 ${2:+version $2}.

## License Checking Workflow

First, run the license check command:
```bash
npm view $1${2:+@$2} license
```

Then analyze the result using this decision tree:

### ✅ COMPATIBLE LICENSES
If the license is one of: **MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD**

**Action:** Proceed with the update
1. Use `/update-license-docs` command to update docs/package-licenses.md
2. If this is a license change from the previous version, note it in the "Notes" column
3. Continue with package installation/update
4. Confirm compatibility has been verified

### 🚨 INCOMPATIBLE LICENSES  
If the license is one of: **GPL, GPL-2.0, GPL-3.0, AGPL, AGPL-3.0, LGPL, LGPL-2.1, LGPL-3.0**

**Action:** Cannot use this package version
1. **Recommend:** Keep the current version (check current version in package.json)
2. **Alternative:** Search for alternatives with: `npm search <package-functionality-keywords>`
3. **Last resort:** Consider if our project license should be changed to accommodate this dependency
4. Document the incompatibility issue for future reference

### ⚠️ REQUIRES MANUAL REVIEW
If the license contains: **"NonCommercial", "NC", "Commercial", proprietary terms**

**Action:** Manual review needed
1. Check if the license restrictions overlap with our non-commercial license (potentially redundant)
2. Verify if the license allows our intended use case (internal productivity, open source contributions)
3. Flag for decision: proceed, find alternatives, or contact package maintainer

### ❓ UNKNOWN/UNDEFINED LICENSE
If npm returns: **undefined, empty, or unrecognized license**

**Action:** Investigation required  
1. Check the package's GitHub repository for LICENSE file
2. Look in package.json for license field
3. Check README.md for license information
4. If still unclear, consider this package high-risk and find alternatives

## Output Format

Always provide a clear summary:
- **License found:** [license name]
- **Compatibility:** ✅ Compatible / 🚨 Incompatible / ⚠️ Needs Review / ❓ Unknown
- **Recommended action:** [specific next steps]
- **Alternative packages:** [if applicable]

This ensures consistent license checking across all package updates and maintains our project's licensing integrity.