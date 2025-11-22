package handlers

import "github.com/gofiber/fiber/v2"

// APIResponse represents a standard API response
type APIResponse struct {
	APIVersion string       `json:"apiVersion,omitempty"`
	Data       interface{}  `json:"data,omitempty"`
	Error      *fiber.Error `json:"error,omitempty"`
}
