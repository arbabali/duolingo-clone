#!/bin/bash

# Base URL
BASE_URL="http://localhost:3001"

# Endpoints
ENDPOINTS=(
  "/api/faq"
  "/api/question"
  "/api/section-details"
  "/api/individual-lang-page-translation"
)

# Lang param values
LANGS=("ja" "de" "fr" "es")

# Output folder
OUTPUT_DIR="duolingo_api_responses"
mkdir -p "$OUTPUT_DIR"

# Fetch /api/faq (no lang param)
echo "Fetching /api/faq..."
curl -s "$BASE_URL/api/faq" -o "$OUTPUT_DIR/faq.json"

# Loop over endpoints that need lang params
for endpoint in "${ENDPOINTS[@]:1}"; do
  for lang in "${LANGS[@]}"; do
    echo "Fetching $endpoint with lang=$lang..."
    formatted_endpoint="${endpoint}?lang=${lang}"
    # Remove leading slash for filename
    filename=$(echo "$endpoint" | sed 's|/api/||')_${lang}.json
    curl -s "$BASE_URL$formatted_endpoint" -o "$OUTPUT_DIR/$filename"
  done
done

echo "✅ All responses saved to $OUTPUT_DIR/"
