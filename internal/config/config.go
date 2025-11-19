package config

import (
	"strings"

	"github.com/spf13/viper"
)

const (
	DefaultListenAddr = ":3000"
)

type MCRunnerConfig struct {
	Name     string `mapstructure:"name"`
	APIURL   string `mapstructure:"apiURL"`
	GRPCAddr string `mapstructure:"grpcAddr"`
}

type Config struct {
	Debug      bool             `mapstructure:"debug"`
	StaticDir  string           `mapstructure:"staticDir"`
	ListenAddr string           `mapstructure:"listenAddr"`
	Servers    []MCRunnerConfig `mapstructure:"servers"`
}

func (c *Config) Sanitize() error {
	if c.ListenAddr == "" {
		c.ListenAddr = DefaultListenAddr
	}
	if c.StaticDir == "" {
		c.StaticDir = "./dist"
	}
	return nil
}

func LoadConfig(filename string) (*Config, error) {
	viper.SetConfigFile(filename)
	viper.SetConfigType("yaml")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, err
	}

	if err := config.Sanitize(); err != nil {
		return nil, err
	}
	return &config, nil
}
