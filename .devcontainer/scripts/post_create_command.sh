#! /bin/bash

# Marks the project's directory as safe in Git.
# Inside a devcontainer, the container's user (vscode) and the host user both
# have different UID/GIDs, leading Git to consider the ownership as dubious.
if [[ -z "$(git config --global safe.directory)" ]]; then
    git config --global --add safe.directory /workspaces/planner-agent-ui
fi
