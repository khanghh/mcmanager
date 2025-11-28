package handlers

import (
	"errors"
	"log"

	"github.com/gofiber/fiber/v2"
)

func ErrorHandler(ctx *fiber.Ctx, err error) error {
	var fiberErr *fiber.Error
	if errors.As(err, &fiberErr) {
		return ctx.Status(fiberErr.Code).JSON(APIResponse{
			APIVersion: "1.0",
			Error:      fiberErr,
		})
	}

	log.Println("handle error:", err.Error())
	return ctx.Status(fiber.StatusInternalServerError).JSON(APIResponse{
		APIVersion: "1.0",
		Error:      fiber.ErrInternalServerError,
	})
}
