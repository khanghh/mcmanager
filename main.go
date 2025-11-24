package main

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	fiberws "github.com/gofiber/websocket/v2"
	"github.com/khanghh/mcmanager/internal/config"
	"github.com/khanghh/mcmanager/internal/gen"
	"github.com/khanghh/mcmanager/internal/handlers"
	"github.com/khanghh/mcmanager/internal/manager"
	"github.com/khanghh/mcmanager/internal/params"
	"github.com/khanghh/mcmanager/internal/websocket"
	"github.com/urfave/cli/v2"
)

var (
	app       *cli.App
	gitCommit string
	gitDate   string
	gitTag    string
)

var (
	configFileFlag = &cli.StringFlag{
		Name:    "config",
		Aliases: []string{"c"},
		Usage:   "Config file path",
		Value:   "config.yaml",
	}
	staticDir = &cli.StringFlag{
		Name:    "staticdir",
		Aliases: []string{"s"},
		Usage:   "Static web assets folder override",
		Value:   "./dist",
	}
	listenFlag = &cli.StringFlag{
		Name:    "listen",
		Aliases: []string{"l"},
		Usage:   "HTTP server listen address override",
		Value:   ":8080",
	}
)

func init() {
	app = cli.NewApp()
	app.EnableBashCompletion = true
	app.Usage = ""
	app.Flags = []cli.Flag{
		configFileFlag,
		staticDir,
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

func mustLoadAppConfig(fileName string) *config.AppConfig {
	appConfig, err := config.LoadAppConfig(fileName)
	if err != nil {
		if os.IsNotExist(err) {
			appConfig, err = config.CreateEmptyConfig(fileName)
			if err != nil {
				log.Fatalf("could not create default config file %s: %v", fileName, err)
			}
		}
		if err != nil {
			log.Fatalf("could not load config file %s: %v", fileName, err)
		}
	}
	return appConfig
}

func getRunnerAPIURLs(runnerCfgs []config.ServerConfig) map[string]string {
	apiURLs := make(map[string]string)
	for _, cfg := range runnerCfgs {
		apiURL, _ := url.JoinPath(cfg.APIURL)
		apiURLs[strings.ToLower(cfg.Name)] = apiURL
	}
	return apiURLs
}

func initWebsocketServer(managerHandler *handlers.MCManagerHandler) *websocket.Server {
	wsServer := websocket.NewServer()
	wsServer.OnConnect(managerHandler.OnWSClientConnect)
	wsServer.OnDisconnect(managerHandler.OnWSClientDisconnect)
	wsServer.RegisterHandler(gen.MessageType_CMD_INPUT, managerHandler.HandleCmdInput)
	wsServer.RegisterHandler(gen.MessageType_CMD_RESIZE, managerHandler.HandleCmdResize)
	wsServer.RegisterHandler(gen.MessageType_CMD_CONNECT, managerHandler.HandleCmdConnect)
	managerHandler.StartBroadcast(wsServer)
	return wsServer
}

func mustInitMCManagerService(servers []config.ServerConfig) *manager.MCManagerService {
	runners := make(map[string]*manager.MCRunnerClient)
	for _, sv := range servers {
		runner, err := manager.NewMCRunnerClient(sv.Name, sv.GRPCAddr)
		if err != nil {
			log.Fatalf("could not initialize MCRunner %q: %v", sv.Name, err)
		}
		runners[strings.ToLower(sv.Name)] = runner
	}
	return manager.NewMCManagerService(runners)
}

func run(cli *cli.Context) error {
	staticDir := cli.String(staticDir.Name)
	listenAddr := cli.String(listenFlag.Name)
	configFile := cli.String(configFileFlag.Name)

	// config
	appConfig := mustLoadAppConfig(configFile)
	configData := appConfig.Value()
	runnerAPIURLs := getRunnerAPIURLs(configData.Servers)

	// services
	managerSvc := mustInitMCManagerService(configData.Servers)

	// handler
	managerHandler := handlers.NewMCManagerHandler(managerSvc)
	appConfigHandler := handlers.NewAppConfigHandler(appConfig)

	// middlewares
	wsUpgradeRequired := func(ctx *fiber.Ctx) error {
		if !fiberws.IsWebSocketUpgrade(ctx) {
			return fiber.ErrUpgradeRequired
		}
		return ctx.Next()
	}

	wsServer := initWebsocketServer(managerHandler)
	router := fiber.New(fiber.Config{
		CaseSensitive: true,
		BodyLimit:     params.ServerBodyLimit,
		IdleTimeout:   params.ServerIdleTimeout,
		ReadTimeout:   params.ServerReadTimeout,
		WriteTimeout:  params.ServerWriteTimeout,
	})
	router.Use(logger.New())
	router.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))
	router.Static("/", staticDir)
	router.Get("/ws", wsUpgradeRequired, wsServer.ServeFiberWS())
	router.Get("/api/config", appConfigHandler.GetConfig)
	router.Post("/api/config", appConfigHandler.PostConfig)
	router.All("/api/servers/:name/*", handlers.MCRunnerProxyHandler(runnerAPIURLs))
	router.Post("/api/shutdown", func(ctx *fiber.Ctx) error {
		go func() {
			_ = wsServer.Shutdown()
			_ = router.Shutdown()
			os.Exit(1)
		}()
		return ctx.SendStatus(fiber.StatusOK)
	})
	// SPA fallback: serve index.html for any non /ws or /api path
	router.Get("/*", func(ctx *fiber.Ctx) error {
		p := ctx.Path()
		if strings.HasPrefix(p, "/api") || strings.HasPrefix(p, "/ws") {
			return fiber.ErrNotFound
		}
		ctx.Set(fiber.HeaderContentType, "text/html")
		return ctx.SendFile(filepath.Join(staticDir, "index.html"))
	})

	sigCh := make(chan os.Signal, 2)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigCh
		go func() {
			_ = wsServer.Shutdown()
			_ = router.Shutdown()
		}()
		<-sigCh
		os.Exit(1)
	}()

	return router.Listen(listenAddr)
}

func main() {
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
