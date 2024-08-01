package server

import (
	"log"
	"net/http"
)

// ServerContext holds the context for the server, including the API URL.
type ServerContext struct {
	APIURL string
}

// Start initializes and starts the HTTPS server with the provided configuration.
func Start(certFile, keyFile, apiURL, port, staticDir string) error {
	ctx := &ServerContext{APIURL: apiURL}

	http.Handle("/", http.FileServer(http.Dir(staticDir)))
	http.HandleFunc("/api/credentials", ctx.HandleCredentials)
	http.HandleFunc("/api/status", HandleStatus)

	// Log server details
	serverName := "Planner Agent UI"
	log.Printf("%s starting...", serverName)
	log.Printf("Static files served from: %s", staticDir)
	log.Printf("API URL: %s", apiURL)
	log.Printf("Listening on: 127.0.0.1:%s", port)
	log.Printf("Using TLS certificate: %s and key: %s", certFile, keyFile)

	log.Printf("%s is up and running on https://127.0.0.1:%s", serverName, port)
	return http.ListenAndServeTLS(":"+port, certFile, keyFile, nil)
}
