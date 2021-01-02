#!/usr/bin/env bash
filename="$1"
schemaname="$2"

result=$(npm run --silent to-schema ./"$filename".request.ts "$schemaname")
json=$(echo "${result//[$'\t\r\n ']}")
node -e "require(\"./script.js\").testChoi(\"$filename\", \"$schemaname\", "$json")"
