# Planner Agent UI Server

This server is part of the Planner Agent UI, designed for managing and displaying vCenter cluster information.

## Features

- **Credential Management:** Collects and manages credentials for vCenter clusters.
- **Status Display:** Shows connection status for clusters.
- **Integration:** Works with the Planner-Agent tool for VMware workload migration.

## Prerequisites

- **Go (Golang):** Ensure Go is installed.
- **SSL Certificates:** The server uses SSL certificates for secure communication.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/kubev2v/planner-agent-ui.git
   cd planner-agent-ui/server
   ```

2. **Install Dependencies and Tools:**
   ```bash
   make tools
   ```

## Configuration

- **CERT_FILE:** Path to the SSL certificate file (default: `config/cert.pem`)
- **KEY_FILE:** Path to the SSL key file (default: `config/key.pem`)
- **API_URL:** URL of the backend API (default: `http://127.0.0.1:3333`)
- **PORT:** Port number for the server (default: `8443`)
- **STATIC_DIR:** Directory for serving static files (default: `static`)

## Usage

1. **Build the Server:**
   ```bash
   make build
   ```

2. **Run the Server:**
   ```bash
   make run
   ```

   The server will start with the configured settings, accessible at the specified port.

## Development

- **Linting:** Ensure code quality with `make lint`.
- **Testing:** Run tests with `make test`.
- **Cleaning:** Remove build artifacts with `make clean`.
