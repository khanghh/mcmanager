package config

import (
	"os"

	"go.yaml.in/yaml/v3"
)

const (
	DefaultListenAddr = ":3000"
)

type ConfigData struct {
	Servers []ServerConfig         `yaml:"servers"`
	VSCode  map[string]interface{} `yaml:"vscode"`
}

type ServerConfig struct {
	Name     string `yaml:"name"`
	Icon     string `yaml:"icon"`
	APIURL   string `yaml:"apiURL"`
	GRPCAddr string `yaml:"grpcURL"`
}

type AppConfig struct {
	configFile string
	configData *ConfigData
	raw        []byte
	changed    bool
}

func (c *AppConfig) Servers() []ServerConfig {
	return c.configData.Servers
}

func (c *AppConfig) VSCode() map[string]interface{} {
	return c.configData.VSCode
}

func (c *AppConfig) Value() *ConfigData {
	return c.configData
}

func (c *AppConfig) Load() (*ConfigData, error) {
	data, err := os.ReadFile(c.configFile)
	if err != nil {
		return nil, err
	}
	c.raw = data

	c.configData = &ConfigData{}
	if err := yaml.Unmarshal(data, c.configData); err != nil {
		return nil, err
	}

	return c.configData, nil
}

func (c *AppConfig) Raw() []byte {
	return c.raw
}

func (c *AppConfig) HasChanged() bool {
	return c.changed
}

func (c *AppConfig) Save(data []byte) error {
	configData := &ConfigData{}
	if err := yaml.Unmarshal(data, &configData); err != nil {
		return err
	}
	if err := os.WriteFile(c.configFile, data, 0644); err != nil {
		return err
	}
	c.configData = configData
	c.changed = true
	return nil
}

func LoadAppConfig(filename string) (*AppConfig, error) {
	cm := &AppConfig{configFile: filename}
	if _, err := cm.Load(); err != nil {
		return nil, err
	}
	return cm, nil
}
