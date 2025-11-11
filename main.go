package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/khanghh/mcmanager/internal/params"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/template/html/v2"
	"github.com/urfave/cli/v2"
)

var (
	app       *cli.App
	gitCommit string
	gitDate   string
	gitTag    string
)

var (
	staticDir = &cli.StringFlag{
		Name:    "staticdir",
		Aliases: []string{"s"},
		Usage:   "Static folder to serve web assets",
		Value:   "./dist",
	}
	apiURLFlag = &cli.StringFlag{
		Name:    "apiurl",
		Aliases: []string{"u"},
		Usage:   "Minecraft server runner API URL",
		Value:   "http://localhost:3000",
	}
	listenFlag = &cli.StringFlag{
		Name:    "listen",
		Aliases: []string{"l"},
		Usage:   "HTTP server listen address",
		Value:   ":8080",
	}
)

func init() {
	app = cli.NewApp()
	app.EnableBashCompletion = true
	app.Usage = ""
	app.Flags = []cli.Flag{
		staticDir,
		apiURLFlag,
		listenFlag,
	}
	app.Commands = []*cli.Command{
		{
			Name:   "version",
			Action: printVersion,
		},
	}
	app.Action = run
}

func printVersion(cli *cli.Context) error {
	fmt.Println(cli.App.Name)
	fmt.Printf(" Version:\t%s\n", params.Version)
	fmt.Printf(" Commit:\t%s\n", gitCommit)
	fmt.Printf(" Built Time:\t%s\n", gitDate)
	return nil
}

func run(cli *cli.Context) error {
	staticDir := cli.String(staticDir.Name)
	listenAddr := cli.String(listenFlag.Name)
	apiURL := cli.String(apiURLFlag.Name)
	if apiURL == "" {
		return fmt.Errorf("apiurl cannot be empty")
	}
	htmlEngine := html.NewFileSystem(http.Dir(staticDir), ".html")
	config := fiber.Map{
		"apiURL": apiURL,
	}
	configStr, _ := json.Marshal(config)
	renderVars := fiber.Map{
		"config": string(configStr),
	}

	router := fiber.New(fiber.Config{
		CaseSensitive: true,
		BodyLimit:     params.ServerBodyLimit,
		IdleTimeout:   params.ServerIdleTimeout,
		ReadTimeout:   params.ServerReadTimeout,
		WriteTimeout:  params.ServerWriteTimeout,
		Views:         htmlEngine,
	})

	router.Use(logger.New())
	router.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.Render("index", renderVars)
	})
	router.Static("/", staticDir)

	return router.Listen(listenAddr)
}

func main() {
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
