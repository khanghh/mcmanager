package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/khanghh/mcmanager/internal/config"
)

type AppConfigHandler struct {
	config *config.AppConfig
}

type feServerConfig struct {
	Name    string `json:"name"`
	Icon    string `json:"icon"`
	LogoURL string `json:"logoUrl,omitempty"`
}

type frontEndConfig struct {
	UserEmail  string                 `json:"userEmail,omitempty"`
	Servers    []feServerConfig       `json:"servers"`
	VSCode     map[string]interface{} `json:"vscode,omitempty"`
	HasChanged bool                   `json:"hasChanged,omitempty"`
}

func (h *AppConfigHandler) GetConfig(ctx *fiber.Ctx) error {
	raw := ctx.QueryBool("raw")
	if raw {
		ctx.Set(fiber.HeaderContentType, "application/x-yaml")
		return ctx.Send(h.config.Raw())
	}

	servers := []feServerConfig{}
	for _, srv := range h.config.Servers() {
		servers = append(servers, feServerConfig{
			Name:    srv.Name,
			Icon:    srv.Icon,
			LogoURL: srv.LogoURL,
		})
	}

	userEmail, _ := ctx.Locals(userEmailCtxKey).(string)

	return ctx.JSON(APIResponse{
		APIVersion: "1.0",
		Data: &frontEndConfig{
			UserEmail:  userEmail,
			Servers:    servers,
			VSCode:     h.config.VSCode(),
			HasChanged: h.config.HasChanged(),
		},
	})
}

func (h *AppConfigHandler) PostConfig(ctx *fiber.Ctx) error {
	data := ctx.Body()
	if err := h.config.Save(data); err != nil {
		return err
	}
	return ctx.SendStatus(fiber.StatusOK)
}

func NewAppConfigHandler(appConfig *config.AppConfig) *AppConfigHandler {
	return &AppConfigHandler{
		config: appConfig,
	}
}
