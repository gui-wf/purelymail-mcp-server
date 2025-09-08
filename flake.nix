{
  description = "PurelyMail MCP Server";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        # Development environment
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.typescript
            nodePackages.typescript-language-server
            jq  # For JSON processing
            yq  # For YAML processing
          ];

          shellHook = ''
            echo "PurelyMail MCP Server Development Environment"
            echo "Node: $(node --version), TypeScript: $(tsc --version)"
            echo ""
            echo "Available commands (see package.json for details):"
            echo "  npm run fetch:swagger    - Download latest API spec"
            echo "  npm run generate:types   - Generate TypeScript types"
            echo "  npm run update:api       - Complete update workflow"
            echo "  nix run .#update-api     - Update API via nix app"
          '';
        };

        # Production package build
        packages.default = pkgs.stdenv.mkDerivation {
          pname = "purelymail-mcp-server";
          version = "1.0.0";
          src = ./.;

          buildInputs = [ pkgs.nodejs_20 ];

          buildPhase = ''
            # Install dependencies (production only)
            npm ci --production

            # Generate types if spec exists (no network calls during build)
            if [ -f purelymail-api-spec.json ]; then
              npm run generate:types
            else
              echo "Warning: purelymail-api-spec.json not found"
              echo "Run 'nix run .#update-api' to fetch latest spec"
            fi

            # Build using package.json script
            npm run build
          '';

          installPhase = ''
            mkdir -p $out/{bin,share/purelymail-mcp}

            # Copy built artifacts
            cp -r dist $out/share/purelymail-mcp/
            cp -r src/types $out/share/purelymail-mcp/
            cp -r src/mocks $out/share/purelymail-mcp/
            cp package.json $out/share/purelymail-mcp/
            cp purelymail-api-spec.json $out/share/purelymail-mcp/ 2>/dev/null || true

            # Create executable
            cat > $out/bin/purelymail-mcp <<EOF
            #!/usr/bin/env node
            require('$out/share/purelymail-mcp/dist/index.js')
            EOF
            chmod +x $out/bin/purelymail-mcp
          '';
        };

        # Nix app for updating API specification
        apps.update-api = {
          type = "app";
          program = toString (pkgs.writeScript "update-api" ''
            #!${pkgs.bash}/bin/bash
            set -euo pipefail

            echo "🔄 Updating PurelyMail API specification..."

            # Ensure we're in the project root
            if [ ! -f package.json ]; then
              echo "❌ Error: Must be run from the project root directory"
              exit 1
            fi

            if [ ! -d node_modules ]; then
              echo "📦 Installing dependencies..."
              ${pkgs.nodejs_20}/bin/npm install
            fi

            # Use the npm script directly (reuse package.json abstraction)
            echo "🚀 Running update:api workflow..."
            ${pkgs.nodejs_20}/bin/npm run update:api

            echo "✅ API specification updated successfully!"
            echo ""
            echo "Next steps:"
            echo "  1. Review changes: git diff"
            echo "  2. Test: npm run test:mock"
            echo "  3. Commit if satisfied: git add . && git commit -m 'Update API specification'"
          '');
        };
      }
    );
}
