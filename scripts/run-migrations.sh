#!/bin/bash
# Run all Supabase migrations against a remote project
# Usage: ./scripts/run-migrations.sh
#
# Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env
if [ -f "$ROOT_DIR/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | xargs)
else
  echo "Error: .env file not found. Copy .env.example to .env and fill in your values."
  exit 1
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
  exit 1
fi

# Extract the database connection string from the Supabase URL
# Format: https://PROJECT_REF.supabase.co -> postgresql://postgres.[PROJECT_REF]:password@...
PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co||')
DB_HOST="aws-0-us-east-1.pooler.supabase.com"
DB_URL="postgresql://postgres.${PROJECT_REF}:${SUPABASE_DB_PASSWORD}@${DB_HOST}:6543/postgres"

MIGRATIONS_DIR="$ROOT_DIR/supabase/migrations"

echo "Running migrations against: $SUPABASE_URL"
echo "Migrations directory: $MIGRATIONS_DIR"
echo ""

# Check if we have psql
if command -v psql &> /dev/null; then
  for migration in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
    echo "Running: $(basename "$migration")"
    psql "$DB_URL" -f "$migration" 2>&1
    echo "  Done."
  done
  echo ""
  echo "All migrations complete!"
else
  echo "psql not found. You can run migrations via the Supabase SQL Editor instead."
  echo ""
  echo "Go to: ${SUPABASE_URL//.supabase.co/.supabase.com}/project/default/sql/new"
  echo ""
  echo "Paste each migration file in order:"
  for migration in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
    echo "  $(basename "$migration")"
  done
  echo ""
  echo "Or install psql: brew install libpq && brew link --force libpq"
fi
