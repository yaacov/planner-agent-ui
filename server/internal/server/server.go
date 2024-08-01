package server

import (
	"log"
	"net/http"
)

type ServerContext struct {
	APIURL string
}

func Start(certFile, keyFile, apiURL, port, staticDir string) error {
	ctx := &ServerContext{APIURL: apiURL}

	http.Handle("/", http.FileServer(http.Dir(staticDir)))
	http.HandleFunc("/api/credentials", ctx.HandleCredentials)
	http.HandleFunc("/api/status", HandleStatus)

	log.Printf("Serving on port %s", port)
	return http.ListenAndServeTLS(":"+port, certFile, keyFile, nil)
}
