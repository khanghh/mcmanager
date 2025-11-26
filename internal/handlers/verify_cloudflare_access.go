package handlers

import (
	"context"
	"fmt"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gofiber/fiber/v2"
	"github.com/khanghh/mcmanager/internal/config"
)

const (
	userEmailCtxKey = "user_email"
)

func VerifyZeroTrustJWT(appConfig *config.AppConfig) fiber.Handler {
	return func(c *fiber.Ctx) error {
		cfConfig := appConfig.Value().CFZeroTrust

		// Check if Zero Trust is configured
		if cfConfig.TeamDomain == "" || cfConfig.PolicyAUD == "" {
			// If not configured, skip verification
			return c.Next()
		}

		ctx := context.Background()
		certsURL := fmt.Sprintf("%s/cdn-cgi/access/certs", cfConfig.TeamDomain)

		oidcConfig := &oidc.Config{
			ClientID: cfConfig.PolicyAUD,
		}

		keySet := oidc.NewRemoteKeySet(ctx, certsURL)
		verifier := oidc.NewVerifier(cfConfig.TeamDomain, keySet, oidcConfig)

		// Make sure that the incoming request has our token header
		// Could also look in the cookies for CF_AUTHORIZATION
		accessJWT := c.Get("Cf-Access-Jwt-Assertion")
		if accessJWT == "" {
			return c.Status(fiber.StatusUnauthorized).SendString("No token on the request")
		}

		// Verify the access token
		idToken, err := verifier.Verify(ctx, accessJWT)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).SendString(fmt.Sprintf("Invalid token: %s", err.Error()))
		}

		var userInfo struct {
			Email string `json:"email"`
		}
		if err := idToken.Claims(&userInfo); err != nil {
			return c.Status(fiber.StatusUnauthorized).SendString(fmt.Sprintf("Failed to parse token claims: %s", err.Error()))
		}
		c.Locals(userEmailCtxKey, userInfo.Email)
		fmt.Println("email:", userInfo.Email)

		return c.Next()
	}
}
