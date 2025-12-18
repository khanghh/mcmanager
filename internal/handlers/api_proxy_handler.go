package handlers

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/proxy"
)

func MCRunnerProxyHandler(apiURLs map[string]string) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		name := ctx.Params("name")
		path := ctx.Params("*")
		apiURL, ok := apiURLs[strings.ToLower(name)]
		if !ok {
			return fiber.NewError(fiber.StatusNotFound)
		}
		fullURL, err := url.JoinPath(apiURL, path)
		if err != nil {
			fmt.Println(err)
			return ctx.SendStatus(fiber.StatusInternalServerError)
		}
		// Append query parameters from the original request
		if queryString := string(ctx.Request().URI().QueryString()); queryString != "" {
			fullURL = fullURL + "?" + queryString
		}
		fmt.Printf("Proxy %s %s\n", ctx.Method(), fullURL)
		return proxy.Do(ctx, fullURL)
	}
}
