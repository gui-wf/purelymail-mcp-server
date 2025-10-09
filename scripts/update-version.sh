#!/usr/bin/env bash
#
# Update version across package.json and flake.nix
# Usage: ./update-version.sh [-y] <version>
#   -y: Non-interactive mode (for automation)
#   version: Semantic version (e.g., 2.0.0, 2.0.0-rc1)
#

set -euo pipefail

# Colors for output (when not in -y mode)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
NON_INTERACTIVE=false
VERSION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -y)
      NON_INTERACTIVE=true
      shift
      ;;
    *)
      VERSION="$1"
      shift
      ;;
  esac
done

# File paths (define early so they can be used throughout)
PACKAGE_JSON="package.json"
FLAKE_NIX="flake.nix"

# Ensure we're in project root
if [[ ! -f "$PACKAGE_JSON" ]] || [[ ! -f "$FLAKE_NIX" ]]; then
  echo "Error: Must be run from project root directory" >&2
  exit 1
fi

# Validate version argument
if [[ -z "$VERSION" ]]; then
  if [[ "$NON_INTERACTIVE" == "true" ]]; then
    echo "Error: Version argument required" >&2
    exit 1
  fi
  if command -v gum >/dev/null 2>&1; then
    VERSION=$(gum input --placeholder "Enter version (e.g., 2.0.0) or press Enter to use current")

    # If user pressed Enter without input, use current version
    if [[ -z "$VERSION" ]]; then
      CURRENT_VERSION=$(jq -r '.version' "$PACKAGE_JSON" 2>/dev/null || echo "")
      if [[ -n "$CURRENT_VERSION" ]]; then
        VERSION="$CURRENT_VERSION"
        gum style --foreground 240 "Using current version: $VERSION"
      else
        echo "Error: Could not determine current version" >&2
        exit 1
      fi
    fi
  else
    echo "Error: gum not found and version not provided" >&2
    exit 1
  fi
fi

# Validate semantic version format
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
  echo "Error: Invalid semantic version format: $VERSION" >&2
  echo "Expected format: X.Y.Z or X.Y.Z-prerelease" >&2
  exit 1
fi

# Read current versions
CURRENT_PACKAGE_VERSION=$(jq -r '.version' "$PACKAGE_JSON")
CURRENT_FLAKE_VERSION=$(grep -E '^\s*version\s*=\s*"' "$FLAKE_NIX" | sed -E 's/.*version\s*=\s*"([^"]+)".*/\1/')

# Check if changes are needed
if [[ "$CURRENT_PACKAGE_VERSION" == "$VERSION" ]] && [[ "$CURRENT_FLAKE_VERSION" == "$VERSION" ]]; then
  if [[ "$NON_INTERACTIVE" == "true" ]]; then
    echo "No changes needed"
    exit 0
  fi

  # Interactive mode: versions are up-to-date
  if command -v gum >/dev/null 2>&1; then
    gum style --foreground 2 "✓ Versions already up to date: $VERSION"
  else
    echo -e "${GREEN}✓ Versions already up to date: $VERSION${NC}"
  fi

  exit 0
fi

# Create backup files
cp "$PACKAGE_JSON" "${PACKAGE_JSON}.backup"
cp "$FLAKE_NIX" "${FLAKE_NIX}.backup"

# Function to restore backups on error
cleanup_on_error() {
  mv "${PACKAGE_JSON}.backup" "$PACKAGE_JSON"
  mv "${FLAKE_NIX}.backup" "$FLAKE_NIX"
  echo "Error: Changes reverted" >&2
  exit 1
}

trap cleanup_on_error ERR

# Update package.json
jq --arg version "$VERSION" '.version = $version' "$PACKAGE_JSON" > "${PACKAGE_JSON}.tmp"
mv "${PACKAGE_JSON}.tmp" "$PACKAGE_JSON"

# Update flake.nix (preserving indentation and comment)
sed -i.bak -E "s/(^\s*#.*AIDEV-TODO.*)/\1/" "$FLAKE_NIX"
sed -i.bak -E "s/(^\s*version\s*=\s*\")[^\"]+(\";)/\1$VERSION\2/" "$FLAKE_NIX"
rm -f "${FLAKE_NIX}.bak"

# Generate diff output
DIFF_OUTPUT=$(diff -u "${PACKAGE_JSON}.backup" "$PACKAGE_JSON" 2>&1 || true)
DIFF_OUTPUT+=$'\n'
DIFF_OUTPUT+=$(diff -u "${FLAKE_NIX}.backup" "$FLAKE_NIX" 2>&1 || true)

# Output based on mode
if [[ "$NON_INTERACTIVE" == "true" ]]; then
  # Non-interactive: output minimal diff
  echo "$DIFF_OUTPUT"
  rm -f "${PACKAGE_JSON}.backup" "${FLAKE_NIX}.backup"
  exit 0
fi

# Interactive mode: use gum for nice display
if command -v gum >/dev/null 2>&1; then
  gum style \
    --border double \
    --border-foreground 212 \
    --padding "1 2" \
    "Version Update Preview"

  echo ""
  gum style --foreground 3 "Changes to be made:"
  echo ""
  echo "$DIFF_OUTPUT"
  echo ""

  if gum confirm "Apply these changes?"; then
    rm -f "${PACKAGE_JSON}.backup" "${FLAKE_NIX}.backup"
    gum style --foreground 2 "✓ Version updated to $VERSION"
    echo ""
    gum style --foreground 240 "Updated files:"
    echo "  • $PACKAGE_JSON"
    echo "  • $FLAKE_NIX"

    exit 0
  else
    mv "${PACKAGE_JSON}.backup" "$PACKAGE_JSON"
    mv "${FLAKE_NIX}.backup" "$FLAKE_NIX"
    gum style --foreground 1 "✗ Changes cancelled"
    exit 1
  fi
else
  # Fallback without gum
  echo -e "${YELLOW}Changes to be made:${NC}"
  echo "$DIFF_OUTPUT"
  echo ""
  read -p "Apply these changes? (y/N) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f "${PACKAGE_JSON}.backup" "${FLAKE_NIX}.backup"
    echo -e "${GREEN}✓ Version updated to $VERSION${NC}"

    exit 0
  else
    mv "${PACKAGE_JSON}.backup" "$PACKAGE_JSON"
    mv "${FLAKE_NIX}.backup" "$FLAKE_NIX"
    echo -e "${RED}✗ Changes cancelled${NC}"
    exit 1
  fi
fi
