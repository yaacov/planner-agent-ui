package server

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
	URL      string `json:"url"`
}

type Status struct {
	Status string `json:"status"`
	Msg    string `json:"msg"`
}

type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (ctx *ServerContext) HandleCredentials(w http.ResponseWriter, r *http.Request) {
	var credentials Credentials
	// Decode the request body into the credentials struct
	err := json.NewDecoder(r.Body).Decode(&credentials)
	if err != nil {
		sendErrorResponse(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Marshal the credentials into JSON to send to the backend
	jsonData, err := json.Marshal(credentials)
	if err != nil {
		sendErrorResponse(w, http.StatusInternalServerError, "Error encoding JSON")
		return
	}

	// Make the PUT request to the backend API
	req, err := http.NewRequest("PUT", ctx.APIURL+"/api/credentials", bytes.NewBuffer(jsonData))
	if err != nil {
		sendErrorResponse(w, http.StatusInternalServerError, "Error creating request: "+err.Error())
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		sendErrorResponse(w, http.StatusInternalServerError, "Error making PUT request: "+err.Error())
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		sendErrorResponse(w, http.StatusInternalServerError, "Error reading response: "+err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(body)
}

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	status := Status{
		Status: "OK",
		Msg:    "Server is running",
	}
	json.NewEncoder(w).Encode(status)
}

// sendErrorResponse sends a JSON error response with a code and message
func sendErrorResponse(w http.ResponseWriter, code int, message string) {
	response := ErrorResponse{
		Code:    code,
		Message: message,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(response)
}
