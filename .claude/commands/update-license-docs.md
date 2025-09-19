---
argument-hint: [package-name] [version] [license] [notes-optional]
description: Update docs/package-licenses.md with new package information
---

Update the package license documentation for $1 version $2 with license $3.

## Update Process

1. **Read current docs/package-licenses.md** to understand the existing format and find the package entry

2. **Determine update type:**
   - **New package:** Add new row to the appropriate table (Runtime Dependencies or Development Dependencies)
   - **Version update:** Update existing package version
   - **License change:** Update license field and add note about the change

3. **Update the markdown table:**
   - Locate the correct table (Runtime Dependencies vs Development Dependencies)
   - Find or create the package row: `| $1 | $2 | $3 | ✅ | ${4:-Version update} |`
   - Maintain alphabetical ordering within each table
   - Ensure consistent formatting with existing entries

4. **Update metadata:**
   - Change "Last updated" date to today's date (2025-01-19)
   - Keep "Package.json version" as 1.0.0 unless the package.json version field has changed

5. **Add notes if provided:**
   - If $4 is provided, use it in the Notes column
   - For license changes, format as: "License changed from [old] to [new]"
   - For new packages, use: "New dependency added"
   - For version updates with same license, use: "Version update"

## Table Format Reference

```markdown
| Package | Version | License | Compatible | Notes |
|---------|---------|---------|------------|-------|
| package-name | x.y.z | MIT | ✅ | Description |
```

## Validation Checklist

Before saving the updated file:
- [ ] Package is in the correct table (runtime vs dev dependencies)
- [ ] Version format is consistent (x.y.z)
- [ ] License name matches npm registry format
- [ ] Compatible column shows ✅ (since we only update compatible packages)
- [ ] Notes column has meaningful information
- [ ] "Last updated" date is current
- [ ] Markdown table formatting is preserved

This command should only be used after `/check-license` has confirmed compatibility.