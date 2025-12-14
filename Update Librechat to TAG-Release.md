# Updating the Brown University LibreChat Fork

This guide outlines the process for updating the Brown University fork of LibreChat with the latest upstream version.

## Step 1: Merge the Upstream Version

The first step is to run a GitHub Action that prepares a pull request with the latest changes from the official LibreChat repository.

1.  Navigate to the **Actions** tab in your GitHub repository.
2.  In the left sidebar, find and click on the **`merge upstream version -> PR`** workflow.
3.  Click the **Run workflow** dropdown on the right.
4.  Enter the official LibreChat version tag you want to merge (e.g., `v0.8.1`) into the **`Upstream tag`** field.
5.  Click **Run workflow**.

The action will create a new branch and a pull request.

-   **If there are no merge conflicts**, the PR will be ready to review and merge.
-   **If there are merge conflicts**, you must resolve them locally before the PR can be merged. Check out the branch created by the action, fix the conflicts, and push your changes.

### Step 1a: Manually Sync Workflow Files

The automation intentionally does not merge changes to the `.github/workflows` directory to protect your custom CI/CD. You must sync these files manually.

1.  Check out the branch created by the workflow (e.g., `sync-upstream-v0.8.1-12345`).
2.  Run the following command, replacing `v0.8.1` with the tag you are merging. This command will overwrite your local workflow files with the ones from the official upstream tag.

    ```bash
    # Replace v0.8.1 with the correct upstream tag
    git checkout v0.8.1 -- .github/workflows
    ```

3.  Commit the synchronized workflow files to your branch.

    ```bash
    # Replace v0.8.1 with the correct upstream tag
    git commit -m "chore: Sync .github/workflows with upstream v0.8.1"
    ```

4.  Push the commit to update the pull request.

    ```bash
    git push
    ```

## Step 2: Automatic Tag Creation

Once the pull request from Step 1 is merged into your `main` branch, the **`Create Tag on Upstream Sync Merge`** action will trigger automatically.

This action reads the version from the merged PR's title and creates a new Git tag with the format `${TAG}-brown-patch` (e.g., `v0.8.1-brown-patch`). This tag marks the successfully updated version in your fork.

## Step 3: Build and Push the Docker Image

The final step is to manually run the workflow that builds the new Docker image from the tag created in Step 2.

1.  Navigate to the **Actions** tab.
2.  Find and click on the **`BROWN UNIVERSITY - Docker Compose Build Latest Patched Image Tag (Manual Dispatch)`** workflow.
3.  Before running, it's good practice to verify that the workflow file (`brown-main-image-workflow.yml`) is configured correctly to **only** push to the GitHub Container Registry (`ghcr.io`). Check that the `Build and push Docker images` step looks like this:

    ```yaml
    # ...
    - name: Build and push Docker images
      uses: docker/build-push-action@v5
      with:
        # ... other options
        tags: |
          ghcr.io/${{ github.repository_owner }}/${{ matrix.image_name }}:${{ env.LATEST_TAG }}
          ghcr.io/${{ github.repository_owner }}/${{ matrix.image_name }}:latest
    # ...
    ```
    Ensure there are no lines referencing Docker Hub.

4.  Click the **Run workflow** dropdown and then the **Run workflow** button to start the build.

The action will automatically find the latest tag ending in `-brown-patch`, build the Docker images, and push them to your repository's packages on `ghcr.io`.

## Step 4: Deploy the New Image

1.  Once the build action from Step 3 is complete, navigate to the **Packages** tab in your GitHub repository and click on the **`librechat-api`** package name.
2.  Find the latest version (e.g., `v0.8.1-brown-patch`) and copy its full container image URL.
3.  Go to your BKE deployment repository.
4.  Open the `ccv-librechat/base/librechat.yaml` file and replace the existing container `image` value with the URL you just copied.
5.  Apply the changes and monitor the pod logs for any errors.
6.  If the pod starts successfully and there are no errors, the update is complete.