package main

import (
	"flag"
	"log"

	"github.com/kubev2v/planner-agent-ui/server/internal/server"
)

func main() {
	certFile := flag.String("cert", "config/cert.pem", "Path to the SSL certificate")
	keyFile := flag.String("key", "config/key.pem", "Path to the SSL key")
	apiURL := flag.String("api-url", "http://127.0.0.1:3333", "Backend API URL")
	port := flag.String("port", "8443", "Port to serve")
	staticDir := flag.String("static-dir", "static", "Directory for static files")

	flag.Parse()

	if err := server.Start(*certFile, *keyFile, *apiURL, *port, *staticDir); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
