package main

import (
	"fmt"
	"net/http"
	"time"
)

type User struct {
	ID       int       `json:"id"`
	Name     string    `json:"name"`
	Email    string    `json:"email"`
	Created  time.Time `json:"created"`
}

type UserService interface {
	GetUser(id int) (*User, error)
	CreateUser(user *User) error
	UpdateUser(user *User) error
	DeleteUser(id int) error
}

func main() {
	fmt.Println("Hello, World!")
}

func processRequest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	
	fmt.Fprintf(w, "Request processed successfully")
}

func calculateSum(a, b int) int {
	return a + b
}

func validateEmail(email string) bool {
	return len(email) > 0 && len(email) < 255
}

type Config struct {
	Port     int    `yaml:"port"`
	Host     string `yaml:"host"`
	Database struct {
		URL      string `yaml:"url"`
		MaxConns int    `yaml:"max_conns"`
	} `yaml:"database"`
}

func NewConfig() *Config {
	return &Config{
		Port: 8080,
		Host: "localhost",
	}
}

func (c *Config) Validate() error {
	if c.Port <= 0 {
		return fmt.Errorf("invalid port: %d", c.Port)
	}
	if c.Host == "" {
		return fmt.Errorf("host cannot be empty")
	}
	return nil
}