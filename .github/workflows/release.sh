
#!/bin/bash
set -e

echo "$PWD"
# Step 0: ensure we're in sync
if [ "$(git status --porcelain)" ]; then
  echo "❌ Pending changes detected. Commit or stash them first."
  exit 1
fi

# Step 1: Read the new version from package.json (after Changesets release)
NEW_VERSION=$(node -p "require('./package.json').version")
echo "version: $NEW_VERSION"

# Calculate major version for tagging
MAJOR=$(echo "$NEW_VERSION" | cut -d. -f1)
echo "major: $MAJOR"

# Step 2: Push commit and tag
git push origin HEAD --tags

# Step 3: Build and push Docker image to GitHub Container Registry
IMAGE_NAME="ghcr.io/pelikhan/action-continuous-translation"
echo "Building Docker image: $IMAGE_NAME:$NEW_VERSION"

# Build the Docker image with version tag
docker build -t "$IMAGE_NAME:$NEW_VERSION" .

# Tag with major version
docker tag "$IMAGE_NAME:$NEW_VERSION" "$IMAGE_NAME:$MAJOR"

# Push both tags
docker push "$IMAGE_NAME:$NEW_VERSION"
docker push "$IMAGE_NAME:$MAJOR"

# Logout from Docker registry for security
docker logout ghcr.io

echo "✅ Docker image pushed to GHCR: $IMAGE_NAME:$NEW_VERSION and $IMAGE_NAME:$MAJOR"

# Update action.yml with new version
sed -i "s|image: .*|image: docker://$IMAGE_NAME:$NEW_VERSION|" action.yml
git add action.yml
git commit -m "[chore] upgrade image in action.yml"
git push origin HEAD

# Step 4: Create GitHub release
gh release create "$NEW_VERSION" --title "$NEW_VERSION" --notes "Patch release $NEW_VERSION"

# Step 5: update major tag if any
git tag -f $MAJOR $NEW_VERSION
git push origin $MAJOR --force

# Update action.yml with Dockerfile in main
sed -i "s|image: .*|image: Dockerfile|" action.yml
git add action.yml
git commit -m "[chore] revert to Dockerfile in action.yml"
git push origin HEAD

echo "✅ GitHub release $NEW_VERSION created successfully."