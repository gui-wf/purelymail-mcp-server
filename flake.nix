{
  description = "PurelyMail MCP Server";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
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
            jq # For JSON processing
            yq # For YAML processing
            gum
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

        # npm publish script
        packages.npm-publish = pkgs.writeScriptBin "npm-publish" ''
          #!${pkgs.bash}/bin/bash
          set -euo pipefail

          if [ -z "''${NPM_TOKEN:-}" ]; then
            echo "❌ Error: NPM_TOKEN environment variable is not set"
            echo "Please set NPM_TOKEN to your npm authentication token"
            echo "Example: NPM_TOKEN=npm_xxxxxxxxxxxx nix run .#npm-publish"
            exit 1
          fi

          echo "📦 Building package..."
          ${pkgs.nodejs_20}/bin/npm run build

          echo "🔍 Testing package..."
          ${pkgs.nodejs_20}/bin/npm run test:mock

          echo "📤 Publishing to npm..."
          ${pkgs.nodejs_20}/bin/npm publish

          echo "✅ Published successfully!"
          echo "Package available at: https://www.npmjs.com/package/purelymail-mcp-server"
        '';

        # Production package build
        packages.default = pkgs.buildNpmPackage {
          pname = "purelymail-mcp-server";
          version = "2.0.0-rc4";
          src = ./.;

          npmDepsHash = "sha256-aUS8yO2xscDjJZf6KjVzCnEA4ZxawVH5gxlTZUyuO0g=";

          # Generate types before building
          preBuild = ''
            if [ -f purelymail-api-spec.json ]; then
              npm run generate:types
            fi
          '';

          # buildNpmPackage automatically runs: npm run build

          installPhase = ''
            runHook preInstall

            mkdir -p $out/{bin,lib}

            # Copy everything needed
            cp -r dist $out/lib/
            cp -r node_modules $out/lib/
            cp -r src $out/lib/
            cp package.json $out/lib/
            cp purelymail-api-spec.json $out/lib/ 2>/dev/null || true

            # Create executable that matches package.json bin field
            cat > $out/bin/purelymail-mcp-server <<EOF
            #!/usr/bin/env bash
            exec ${pkgs.nodejs_20}/bin/node $out/lib/dist/index.js "\$@"
            EOF
            chmod +x $out/bin/purelymail-mcp-server

            runHook postInstall
          '';
        };

        # Nix app for updating API specification
        apps.update-api = {
          type = "app";
          program = toString (
            pkgs.writeScript "update-api" ''
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
            ''
          );
        };

        # Nix app for updating version across package.json and flake.nix
        apps.update-version = {
          type = "app";
          program = toString (
            pkgs.writeScript "update-version-wrapper" ''
              #!${pkgs.bash}/bin/bash
              export PATH=${
                pkgs.lib.makeBinPath [
                  pkgs.gum
                  pkgs.jq
                  pkgs.gnused
                  pkgs.diffutils
                  pkgs.git
                ]
              }:$PATH
              exec ${pkgs.bash}/bin/bash ${./scripts/update-version.sh} "$@"
            ''
          );
        };

        # Nix app for publishing to npm
        apps.npm-publish = {
          type = "app";
          program = "${self.packages.${system}.npm-publish}/bin/npm-publish";
        };

        # Default app - run the MCP server
        apps.default = {
          type = "app";
          program = "${self.packages.${system}.default}/bin/purelymail-mcp-server";
        };
      }
    );
}
