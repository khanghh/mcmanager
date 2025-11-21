package handlers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func MCRunnerProxyHandler(apiURLs map[string]string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		name := c.Params("name")
		apiURL, ok := apiURLs[strings.ToLower(name)]
		if !ok {
			return fiber.NewError(fiber.StatusNotFound)
		}
		return proxy.Do(c, apiURL)
	}
}
