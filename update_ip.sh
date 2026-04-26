#!/bin/bash

# Check if new IP argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <new_ip_address>"
  echo "Example: $0 44.205.8.150"
  exit 1
fi

NEW_IP=$1
STATE_FILE=".current_ip"

# Check if state file exists, otherwise auto-detect
if [ ! -f "$STATE_FILE" ]; then
  echo "No state file found. Attempting to auto-detect the old IP from the codebase..."
  
  # Auto-detect IP from the CI pipeline file (a reliable source of truth in the repo)
  OLD_IP=$(grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}' .github/workflows/ci-pipeline.yml | head -1)
  
  if [ -z "$OLD_IP" ]; then
    echo "Error: Could not auto-detect the old IP address. Please verify your codebase."
    exit 1
  fi
  
  echo "Auto-detected Old IP: $OLD_IP"
  echo "$OLD_IP" > "$STATE_FILE"
else
  OLD_IP=$(cat "$STATE_FILE")
fi

if [ -z "$OLD_IP" ]; then
  echo "Error: Old IP from $STATE_FILE is empty."
  exit 1
fi

if [ "$OLD_IP" == "$NEW_IP" ]; then
  echo "The new IP ($NEW_IP) is the same as the old IP. Nothing to update."
  exit 0
fi

echo "Replacing $OLD_IP with $NEW_IP..."

# Define cross-platform sed wrapper
# macOS requires an empty string for the -i flag backup extension
sedi() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

modified_files=()

# Gather all target files (handles globbing)
shopt -s nullglob
target_files=(
  .github/workflows/*.yml
  .github/workflows/*.yaml
  k8s-manifests/02-services.yaml
  frontend-react/.env
)
shopt -u nullglob

# Perform search and replace
for file in "${target_files[@]}"; do
  if [ -f "$file" ]; then
    # Check if the old IP actually exists in the file before updating
    if grep -q "$OLD_IP" "$file"; then
      sedi "s/$OLD_IP/$NEW_IP/g" "$file"
      modified_files+=("$file")
      echo " ✅ Updated: $file"
    fi
  fi
done

# Handle results and save state
if [ ${#modified_files[@]} -eq 0 ]; then
  echo "⚠️  No files needed updating (could not find $OLD_IP in target files)."
else
  echo -e "\n🎉 Successfully replaced the IP address globally!"
fi

echo "$NEW_IP" > "$STATE_FILE"
echo "💾 Updated state tracking: $STATE_FILE now contains $NEW_IP"
