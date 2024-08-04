#!/bin/bash

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Determine which container runtime to use
if command_exists podman; then
    CONTAINER_RUNTIME="podman"
elif command_exists docker; then
    CONTAINER_RUNTIME="docker"
else
    echo "Neither Podman nor Docker is installed. Please install one of them to proceed."
    exit 1
fi

# Print the selected container runtime
#echo "Using $CONTAINER_RUNTIME as the container runtime."

$CONTAINER_RUNTIME "$@"
