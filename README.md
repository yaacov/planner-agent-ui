# Planner-Agent UI

The Planner-Agent UI is a tool designed for managing and displaying vCenter cluster information, integrated with the Planner-Agent tool for VMware workload migration. The repository contains two main components:

1. **Client:** Holds the HTML, JavaScript, and static files served by the server.
2. **Server:** A CLI server that serves the static content and connects to the Planner-Agent.

### Running the Container Image

To start the HTTP server, run the container image using the following command. The server will listen on port 8443 and display a page with a form for entering cluster credentials. This data will be sent to an API server running on port 3333.

```bash
podman run -it -p 8443:8443 quay.io/kubev2v/planner-agent-ui
```

## Features

- **Credential Management**
- **Status Display**
- **Integration with Planner-Agent**

## Prerequisites

- **Go (Golang)**
- **SSL Certificates**

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

- **CERT_FILE:** SSL certificate file
- **KEY_FILE:** SSL key file
- **API_URL:** Backend API URL
- **PORT:** Server port
- **STATIC_DIR:** Directory for static files

## Usage

1. **Build the Server:**
   ```bash
   make build
   ```

2. **Run the Server:**
   ```bash
   make run
   ```

## Development

- **Linting:** `make lint`
- **Testing:** `make test`
- **Cleaning:** `make clean`
