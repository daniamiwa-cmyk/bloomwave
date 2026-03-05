#!/bin/bash
# Seed all personas from scripts/personas.json into the database
# Usage: ./scripts/seed-personas.sh
#
# Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env
if [ -f "$ROOT_DIR/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | xargs)
else
  echo "Error: .env file not found."
  exit 1
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
  exit 1
fi

PERSONAS_FILE="$SCRIPT_DIR/personas.json"
if [ ! -f "$PERSONAS_FILE" ]; then
  echo "Error: personas.json not found at $PERSONAS_FILE"
  exit 1
fi

echo "Seeding personas from: $PERSONAS_FILE"
echo "Target: $SUPABASE_URL"

# Use Supabase REST API to upsert personas
TOTAL=$(jq length "$PERSONAS_FILE")
echo "Found $TOTAL personas to seed"

# Insert in batches using the REST API
jq -c '.[]' "$PERSONAS_FILE" | while read -r persona; do
  slug=$(echo "$persona" | jq -r '.slug')
  echo "  Seeding: $slug"

  response=$(curl -s -w "\n%{http_code}" \
    -X POST "${SUPABASE_URL}/rest/v1/personas" \
    -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates" \
    -d "$persona")

  http_code=$(echo "$response" | tail -1)
  if [ "$http_code" != "201" ] && [ "$http_code" != "200" ]; then
    body=$(echo "$response" | sed '$d')
    echo "    Warning: HTTP $http_code - $body"
  fi
done

echo ""
echo "Persona seeding complete! ($TOTAL personas)"
echo ""
echo "To auto-unlock tier 1 personas for existing users, run:"
echo "  INSERT INTO user_persona_unlocks (user_id, persona_id, unlock_method)"
echo "  SELECT up.user_id, p.id, 'starter'"
echo "  FROM user_profiles up CROSS JOIN personas p"
echo "  WHERE p.tier = 1"
echo "  ON CONFLICT DO NOTHING;"
