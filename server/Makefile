GOBASE=$(shell pwd)
GOBIN=$(GOBASE)/bin

MODULE_NAME=planner-agent-ui
BUILD_DIR=build
BINARY_NAME=planner-agent-ui
STATIC_DIR=static
CERT_FILE=config/cert.pem
KEY_FILE=server/config/key.pem
API_URL=http://127.0.0.1:3333
PORT=8443

# Linting
lint: tools
	$(GOBIN)/golangci-lint run ./...

# Testing
test:
	go test ./... -v

# Build
build:
	go build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd

# Image
image:
	podman build -t quay.io/kubev2v/planner-agent-ui .

# Run image
run-image:
	podman run -it -p 8443:8443 quay.io/kubev2v/planner-agent-ui

# Run
run: build
	$(BUILD_DIR)/$(BINARY_NAME) --cert=$(CERT_FILE) --key=$(KEY_FILE) --api-url=$(API_URL) --port=$(PORT) --static-dir=$(STATIC_DIR)

# Clean
clean:
	rm -rf $(BUILD_DIR)

tools: $(GOBIN)/golangci-lint

$(GOBIN)/golangci-lint:
	curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(GOBIN) v1.54.0

# Full sequence
all: lint test build run

.PHONY: tools lint test build run clean all
