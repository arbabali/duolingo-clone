for file in api/*.js; do
  printf '%s\n' 'res.setHeader("Access-Control-Allow-Origin", "*");' \
                'res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");' \
                'res.setHeader("Access-Control-Allow-Headers", "Content-Type");' \
                '' \
                'if (req.method === "OPTIONS") return res.status(200).end();' \
                '' \
                "$(cat "$file")" > "$file.tmp" && mv "$file.tmp" "$file"
done
