package server

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

// Credentials holds the vCenter cluster credentials.
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
	URL      string `json:"url"`
}

// Status represents the current status of the server.
type Status struct {
	Status string `json:"status"`
	Msg    string `json:"msg"`
}

// ErrorResponse represents an error response to be sent to the client.
type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// HandleCredentials processes the incoming credentials and sends them to the backend API.
func (ctx *ServerContext) HandleCredentials(w http.ResponseWriter, r *http.Request) {
	var credentials Credentials
	// Decode the request body into the credentials struct
	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		sendErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Send credentials to the backend API
	respBody, statusCode, err := ctx.sendCredentialsToBackend(credentials)
	if err != nil {
		sendErrorResponse(w, http.StatusInternalServerError, "Error making PUT request: "+err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(respBody)
}

// HandleStatus responds with a simple status message indicating that the server is running.
func HandleStatus(w http.ResponseWriter, r *http.Request) {
	status := Status{
		Status: "OK",
		Msg:    "Server is running",
	}
	json.NewEncoder(w).Encode(status)
}

// sendCredentialsToBackend sends the credentials to the backend API and returns the response body, status code, and any error encountered.
func (ctx *ServerContext) sendCredentialsToBackend(credentials Credentials) ([]byte, int, error) {
	// Marshal the credentials into JSON
	jsonData, err := json.Marshal(credentials)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	// Make the PUT request to the backend API
	req, err := http.NewRequest("PUT", ctx.APIURL+"/credentials", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return body, resp.StatusCode, nil
}

// sendErrorResponse sends a JSON-formatted error response with the given HTTP status code and message.
func sendErrorResponse(w http.ResponseWriter, code int, message string) {
	response := ErrorResponse{
		Code:    code,
		Message: message,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(response)
}
