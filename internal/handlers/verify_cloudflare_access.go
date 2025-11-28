package handlers

import (
	"context"
	"fmt"
	"net"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gofiber/fiber/v2"
	"github.com/khanghh/mcmanager/internal/config"
)

const (
	userEmailCtxKey = "user_email"
)

func isPrivateIP(ipStr string) bool {
	// Remove port if present
	host, _, err := net.SplitHostPort(ipStr)
	if err != nil {
		host = ipStr
	}

	ip := net.ParseIP(host)
	if ip == nil {
		return false
	}

	// Check for loopback
	if ip.IsLoopback() {
		return true
	}

	// Check for private IP ranges
	privateRanges := []string{
		"10.0.0.0/8",
		"172.16.0.0/12",
		"192.168.0.0/16",
	}

	for _, cidr := range privateRanges {
		_, block, _ := net.ParseCIDR(cidr)
		if block.Contains(ip) {
			return true
		}
	}

	return false
}

func getClientIP(c *fiber.Ctx) string {
	clientIP := c.Get("Cf-Connecting-Ip")
	if clientIP != "" {
		return clientIP
	}
	clientIP = c.Get("X-Forwarded-For")
	if clientIP != "" {
		// In case of multiple IPs, take the first one
		if idx := len(clientIP); idx != -1 {
			clientIP = clientIP[:idx]
		}
		return clientIP
	}
	return c.IP()
}

func VerifyZeroTrustJWT(appConfig *config.AppConfig) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Skip verification for private IP addresses
		clientIP := getClientIP(c)
		if isPrivateIP(clientIP) {
			return c.Next()
		}

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

		return c.Next()
	}
}
