#!/bin/bash

INPUT_DIR="api"
AUDIO_DIR="audio"

# Create the output directory if it doesn't exist
mkdir -p "$AUDIO_DIR"

# Loop over all question_*.json files
for file in "$INPUT_DIR"/question_*.json; do
 echo "🔍 Processing $file"

URLS=$(jq -r '[.questions[] | ([.tts] + (.options[]?.tts // []))] | flatten | .[]' "$file" | sort -u)

for url in $URLS; do
  filename=$(basename "$url")
  output_path="$AUDIO_DIR/$filename"

  if [[ -f "$output_path" ]]; then
    echo "🔁 Skipping (already exists): $filename"
    continue
  fi

  echo "⬇️ Downloading $filename ..."
  curl -s "$url" -o "$output_path"

  if [[ $? -eq 0 ]]; then
    echo "✅ Saved to $output_path"
  else
    echo "❌ Failed to download $url"
  fi
  done
done

echo "🎉 All TTS audio files downloaded to $AUDIO_DIR/"
