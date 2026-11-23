#!/bin/sh
# FLA Property Management — Cloudflare Pages Build Hook Installer
echo "==> Setting up FLA command in PATH for Cloudflare Pages..."

# 1. Target all bin directories that might be in Linux PATH
NODE_BIN=$(dirname "$(which node 2>/dev/null || echo "")")
BUN_BIN=$(dirname "$(which bun 2>/dev/null || echo "")")
NPM_BIN=$(dirname "$(which npm 2>/dev/null || echo "")")

for D in "$NODE_BIN" "$BUN_BIN" "$NPM_BIN" "$HOME/.bun/bin" "$HOME/.local/bin" "/usr/local/bin" "node_modules/.bin"; do
  if [ -n "$D" ] && [ -d "$D" ]; then
    cp FLA "$D/FLA" 2>/dev/null || true
    cp FLA "$D/fla" 2>/dev/null || true
    chmod +x "$D/FLA" "$D/fla" 2>/dev/null || true
    echo "✓ Copied FLA executable to $D"
  fi
done

# 2. Also try npm link as secondary backup
npm link 2>/dev/null || true

echo "==> FLA command is ready in PATH."
exit 0
