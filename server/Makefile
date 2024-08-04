IMAGE_REGISTRY     ?= quay.io
REGISTRY_NAMESPACE ?= kubev2v
IMAGE_TAG          ?= latest

CONTAINER_RUNTIME=scripts/container-wrapper.sh

GOLANDCI_LINT_VERSION ?= v1.57.0

GOPATH?=$(shell go env GOPATH)
GOBIN?=$(GOPATH)/bin

STATIC_DIR=static
CERT_FILE=config/cert.pem
KEY_FILE=config/key.pem
API_URL=http://127.0.0.1:3333
PORT=8443

# Linting
lint:
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@$(GOLANDCI_LINT_VERSION)
	$(GOBIN)/golangci-lint run

# Testing
test:
	go test ./... -v

# Build
build:
	go build -o build/planner-agent-ui ./cmd

# Image
build-image:
	$(CONTAINER_RUNTIME) build -t $(IMAGE_REGISTRY)/$(REGISTRY_NAMESPACE)/planner-agent-ui:$(IMAGE_TAG) .

# Run image
.ONESHELL:
run-image:
	$(CONTAINER_RUNTIME) run -it \
		--name planner-agent-ui \
		-p 8443:8443 \
		$(IMAGE_REGISTRY)/$(REGISTRY_NAMESPACE)/planner-agent-ui:$(IMAGE_TAG)

# Run
run: build
	build/planner-agent-ui --cert=$(CERT_FILE) --key=$(KEY_FILE) --api-url=$(API_URL) --port=$(PORT) --static-dir=$(STATIC_DIR)

# Clean
clean:
	rm -rf build

# Full sequence
all: lint test build run

.PHONY: tools lint test build run clean all
