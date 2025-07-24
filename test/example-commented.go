// Package main demonstrates Go comment generation functionality.
// This package contains examples of various Go constructs with proper documentation.
package main

import (
	"fmt"
	"net/http"
	"time"
)

// User represents a system user with authentication and profile information.
// It contains the essential fields needed for user management and tracking.
type User struct {
	ID       int       `json:"id"`       // Unique identifier for the user
	Name     string    `json:"name"`     // Full name of the user
	Email    string    `json:"email"`    // Email address for authentication and communication
	Created  time.Time `json:"created"`  // Timestamp when the user was created
}

// UserService defines the contract for user management operations.
// Implementations should handle user CRUD operations and validation.
type UserService interface {
	// GetUser retrieves a user by their unique identifier.
	GetUser(id int) (*User, error)
	// CreateUser creates a new user in the system.
	CreateUser(user *User) error
	// UpdateUser updates an existing user's information.
	UpdateUser(user *User) error
	// DeleteUser removes a user from the system by their identifier.
	DeleteUser(id int) error
}

// main is the entry point of the application.
// It demonstrates basic functionality and prints a greeting message.
func main() {
	fmt.Println("Hello, World!")
}

// processRequest handles HTTP requests and validates the request method.
// It only accepts POST requests and returns an error for other methods.
func processRequest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	fmt.Fprintf(w, "Request processed successfully")
}

// calculateSum adds two integers and returns their sum.
// This is a simple arithmetic operation for demonstration purposes.
func calculateSum(a, b int) int {
	return a + b
}

// validateEmail performs basic email validation checking length constraints.
// It ensures the email is not empty and within reasonable length limits.
func validateEmail(email string) bool {
	return len(email) > 0 && len(email) < 255
}

// Config represents the application configuration structure.
// It contains server settings and database connection parameters.
type Config struct {
	Port     int    `yaml:"port"`     // Server port number
	Host     string `yaml:"host"`     // Server host address
	Database struct {
		URL      string `yaml:"url"`       // Database connection URL
		MaxConns int    `yaml:"max_conns"` // Maximum number of database connections
	} `yaml:"database"`
}

// NewConfig creates a new Config instance with default values.
// It initializes the configuration with sensible defaults for local development.
func NewConfig() *Config {
	return &Config{
		Port: 8080,
		Host: "localhost",
	}
}

// Validate checks if the configuration values are valid and returns an error if not.
// It verifies that the port number is positive and the host is not empty.
func (c *Config) Validate() error {
	if c.Port <= 0 {
		return fmt.Errorf("invalid port: %d", c.Port)
	}
	if c.Host == "" {
		return fmt.Errorf("host cannot be empty")
	}
	return nil
}