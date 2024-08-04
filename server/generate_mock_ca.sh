#!/bin/bash

# Set file names for the output certificate and key
CERT_FILE="cert.pem"
KEY_FILE="key.pem"

# Generate a private key
openssl genpkey -algorithm RSA -out "$KEY_FILE" -pkeyopt rsa_keygen_bits:2048

# Generate a self-signed certificate
openssl req -x509 -new -nodes -key "$KEY_FILE" -sha256 -days 365 -out "$CERT_FILE" -subj "/C=US/ST=MockState/L=MockCity/O=MockOrganization/OU=MockUnit/CN=mockca.example.com"

echo "Mock CA certificate and key generated:"
echo "Certificate: $CERT_FILE"
echo "Key: $KEY_FILE"
