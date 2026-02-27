# MCManager

MCManager is a central hub and web dashboard designed to manage multiple Minecraft server instances powered by [MCRunner](https://github.com/khanghh/mcrunner) clients. Built with Go and Fiber on the backend, and Vue.js on the frontend, it provides a feature-rich, low-latency interface for overseeing and interacting with your Minecraft servers.

## Features

- **Centralized Dashboard**: Manage multiple `mcrunner` instances from a single web interface.
- **Web-based Terminal**: Real-time server console interaction using WebSockets.
- **API & gRPC Proxying**: Seamlessly proxies REST API and gRPC requests to respective runner instances.
- **Zero Trust Authentication**: Secures your dashboard via Cloudflare Zero Trust
- **Modern SPA Frontend**: Highly responsive and styled frontend built with Vue 3, Vite, and Tailwind CSS.
- **Dynamic Configuration**: Easily define and manage your backend instances in a simple YAML configuration file.

## Architecture

MCManager acts as a centralized controller:
1. **Frontend**: A Vue.js Single Page Application (SPA) served statically by the backend.
2. **Backend**: A Go-based server utilizing the Fiber web framework.
3. **MCRunner Clients**: The backend securely connects to remote MCRunner instances (via gRPC and API URLs) to relay commands, fetch statuses, and stream console output to the proxying WebSockets.

## Requirements

- **Go**: 1.25.0 or higher
- **Node.js/npm/pnpm**: For building the frontend
- **Docker**: (Optional) For containerized deployment

## Building the Project

### 1. Build the Frontend

Navigate to the `web` directory, install dependenciesa, and build the SPA:

```bash
cd web
npm install
npm run build
```

This will generate the built static assets (typically in `web/dist` depending on the build configuration).

### 2. Build the Backend

You can use the provided `Makefile` to build the backend binary:

```bash
make mcmanager
```

The compiled output will be placed inside `build/bin/mcmanager`.

*(Optional)* To compile into a Docker image:
```bash
make build-docker
```

## Running MCManager

Run the compiled binary. By default, it expects a `config.yaml` file in the same directory and serves static files from `./dist` on port `8080`.

```bash
./build/bin/mcmanager --config config.yaml --staticdir ./web/dist --listen :8080
```

### Command Line Arguments

| Flag | Alias | Description | Default |
|-------------|---------|----------------------------------------------------------|---------------|
| `--config` | `-c` | Config file path | `config.yaml` |
| `--staticdir`| `-s` | Static web assets folder override (the SPA output dir) | `./dist` |
| `--listen` | `-l` | HTTP server listen address override | `:8080` |

## Configuration

If a configuration file is not found at the specified path upon startup, a default one will be automatically created.

You can populate the configuration file (`config.yaml`) with your runner details:

```yaml
servers:
  - name: "Survival"
    apiurl: "http://10.0.0.5:8080"
    grpcurl: "10.0.0.5:9090"
```
## Screenshots
![Screenshot](./screenshots/image.png)

## License and Credits

- Backend framework powered by [Fiber](https://gofiber.io/).
- Frontend built from the [TailAdmin Vue](https://github.com/TailAdmin/vue-tailwind-admin-dashboard) template.
