package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/kubev2v/planner-agent-ui/server/internal/server"
)

func TestHandleCredentials(t *testing.T) {
	// Mock backend server
	backendServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Expect a PUT request
		if r.Method != http.MethodPut {
			t.Errorf("Expected 'PUT' request, got '%s'", r.Method)
		}
		// Check the request payload
		var credentials server.Credentials
		err := json.NewDecoder(r.Body).Decode(&credentials)
		if err != nil {
			t.Fatalf("Failed to decode request body: %v", err)
		}

		if credentials.Username != "testuser" || credentials.Password != "testpass" || credentials.URL != "http://test.com" {
			t.Errorf("Unexpected credentials: %+v", credentials)
		}

		// Respond with success
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"result": "success"}`))
	}))
	defer backendServer.Close()

	// Create the server context with the mock backend URL
	ctx := &server.ServerContext{APIURL: backendServer.URL}

	// Mock request payload
	payload := server.Credentials{
		Username: "testuser",
		Password: "testpass",
		URL:      "http://test.com",
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("Failed to marshal JSON: %v", err)
	}

	// Create a request to pass to our handler
	req, err := http.NewRequest("POST", "/api/credentials", bytes.NewBuffer(jsonPayload))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// Record the response
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(ctx.HandleCredentials)
	handler.ServeHTTP(rr, req)

	// Check the status code is what we expect
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	// Check the response body is what we expect
	expected := `{"result": "success"}`
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
	}
}

func TestHandleStatus(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/status", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(server.HandleStatus)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	expected := server.Status{
		Status: "OK",
		Msg:    "Server is running",
	}
	var actual server.Status
	if err := json.NewDecoder(rr.Body).Decode(&actual); err != nil {
		t.Fatalf("Failed to decode response body: %v", err)
	}

	if expected != actual {
		t.Errorf("handler returned unexpected body: got %v want %v", actual, expected)
	}
}
