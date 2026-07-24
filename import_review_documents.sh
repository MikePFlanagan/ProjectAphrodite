#!/usr/bin/env bash
set -euo pipefail

#########################################
# Run from the ProjectAphrodite root
#########################################

if [[ ! -f "pnpm-workspace.yaml" ]]; then
    echo "Error: Run this from the ProjectAphrodite repository root."
    exit 1
fi

DOWNLOADS="$HOME/Downloads"

DOC_DEST="docs/reviews"
SCRIPT_DEST="scripts/reviews"

mkdir -p "$DOC_DEST"
mkdir -p "$SCRIPT_DEST"

echo "----------------------------------------"
echo "Copying review documents..."
echo "----------------------------------------"

DOCS=(
PROJECT_APHRODITE_NEXT_SPRINT_ARCHITECTURE_FINDINGS.md
PROJECT_APHRODITE_AUTH_DATABASE_REVIEW.md
PROJECT_APHRODITE_API_CHAT_RELATIONSHIP_REVIEW.md
PROJECT_APHRODITE_FLUX_CREATOR_IMAGE_REVIEW.md
PROJECT_APHRODITE_STRIPE_DEPLOYMENT_PRODUCTION_REVIEW.md
PROJECT_APHRODITE_FINAL_ENGINEERING_REPORT.md
)

for file in "${DOCS[@]}"; do
    if [[ -f "$DOWNLOADS/$file" ]]; then
        cp "$DOWNLOADS/$file" "$DOC_DEST/"
        echo "✓ $file"
    else
        echo "Missing: $file"
    fi
done

echo
echo "----------------------------------------"
echo "Copying helper scripts..."
echo "----------------------------------------"

SCRIPTS=(
add_architecture_findings_to_repo.sh
add_auth_database_review_to_repo.sh
add_api_chat_relationship_review_to_repo.sh
add_flux_creator_image_review_to_repo.sh
add_stripe_deployment_review_to_repo.sh
add_final_engineering_report_to_repo.sh
)

for file in "${SCRIPTS[@]}"; do
    if [[ -f "$DOWNLOADS/$file" ]]; then
        cp "$DOWNLOADS/$file" "$SCRIPT_DEST/"
        chmod +x "$SCRIPT_DEST/$file"
        echo "✓ $file"
    else
        echo "Missing: $file"
    fi
done

echo
echo "----------------------------------------"
echo "Files copied."
echo "----------------------------------------"

echo
echo "Review documents:"
ls -1 "$DOC_DEST"

echo
echo "Scripts:"
ls -1 "$SCRIPT_DEST"

echo
git status
