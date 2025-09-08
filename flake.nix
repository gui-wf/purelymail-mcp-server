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
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.typescript
            nodePackages.typescript-language-server
            nodePackages.pnpm
            # Swagger codegen tools
            openapi-generator-cli
            jq
            yq
          ];

          shellHook = ''
            echo "PurelyMail MCP Server Development Environment"
            echo "Node version: $(node --version)"
            echo "TypeScript version: $(tsc --version)"
            echo "OpenAPI Generator: $(openapi-generator-cli version)"

            # Generate TypeScript client if spec exists
            if [ -f purelymail-api-spec.json ] && [ ! -d generated-client ]; then
              echo "Generating TypeScript client from swagger spec..."
              npm run generate:types
            fi
          '';
        };

        packages.default = pkgs.stdenv.mkDerivation {
          pname = "purelymail-mcp-server";
          version = "1.0.0";
          src = ./.;

          buildInputs = with pkgs; [
            nodejs_20
            openapi-generator-cli
          ];

          buildPhase = ''
            npm ci --production
            npm run generate:client
            npm run build
          '';

          installPhase = ''
            mkdir -p $out/bin
            cp -r dist $out/
            cp -r generated-client $out/
            cp package.json $out/

            cat > $out/bin/purelymail-mcp <<EOF
            #!/usr/bin/env node
            require('$out/dist/index.js')
            EOF
            chmod +x $out/bin/purelymail-mcp
          '';
        };
      }
    );
}
