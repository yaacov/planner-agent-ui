# Builder container
FROM registry.access.redhat.com/ubi9/go-toolset as builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Run build as supper tux
USER 0
RUN go build -o /planner-agent-ui cmd/main.go

# Web server container
FROM registry.access.redhat.com/ubi9/ubi

WORKDIR /app

COPY --from=builder /planner-agent-ui /app/
COPY config/cert.pem config/key.pem /app/config/
COPY static /app/static

# Use none-root user
RUN chown -R 1001:0 /app
USER 1001

# Run the server
EXPOSE 8443
CMD ["/app/planner-agent-ui", "--cert=/app/config/cert.pem", "--key=/app/config/key.pem", "--api-url=http://localhost:8080", "--port=8443", "--static-dir=/app/static"]
