package main

import (
	"fmt"
	"log"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	fiberws "github.com/gofiber/websocket/v2"
	"github.com/khanghh/mcmanager/internal/config"
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

func mustLoadConfig(cli *cli.Context) *config.Config {
	configFile := cli.String(configFileFlag.Name)
	config, err := config.LoadConfig(configFile)
	if err != nil {
		log.Fatalf("could not load config file: %v", err)
	}
	staticDir := cli.String(staticDir.Name)
	if staticDir != "" {
		config.StaticDir = staticDir
	}
	listenAddr := cli.String(listenFlag.Name)
	if listenAddr != "" {
		config.ListenAddr = listenAddr
	}
	return config
}

func mustInitRunnerList(runnerCfgs []config.MCRunnerConfig) []*manager.MCRunner {
	runners := make([]*manager.MCRunner, 0, len(runnerCfgs))
	for _, cfg := range runnerCfgs {
		runner, err := manager.NewMCRunner(cfg.Name, cfg.GRPCAddr)
		if err != nil {
			log.Fatalf("could not initialize MCRunner %q: %v", cfg.Name, err)
		}
		runners = append(runners, runner)
	}
	return runners
}

func getRunnerAPIURLs(runnerCfgs []config.MCRunnerConfig) map[string]string {
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
	wsServer.OnMessage(managerHandler.OnWSMessage)
	return wsServer
}

func run(cli *cli.Context) error {
	config := mustLoadConfig(cli)
	runners := mustInitRunnerList(config.Servers)
	runnerAPIURLs := getRunnerAPIURLs(config.Servers)

	managerSvc := manager.NewMCManagerService(runners)
	managerHandler := handlers.NewMCManagerHandler(managerSvc)
	wsServer := initWebsocketServer(managerHandler)

	var (
		wsUpgradeRequired = func(ctx *fiber.Ctx) error {
			if !fiberws.IsWebSocketUpgrade(ctx) {
				return fiber.ErrUpgradeRequired
			}
			return ctx.Next()
		}
	)

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

	router.Static("/", config.StaticDir)
	router.All("/api/:name", handlers.MCRunnerProxyHandler(runnerAPIURLs))
	router.Get("/ws", wsUpgradeRequired, wsServer.ServeFiberWS())

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

	return router.Listen(config.ListenAddr)
}

func main() {
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
