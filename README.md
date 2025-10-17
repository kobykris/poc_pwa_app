# PWA Push Notification

A Proof of Concept (PoC) project demonstrating Progressive Web App (PWA) capabilities, focusing on Web Push Notifications.

## Prerequisites

- Docker
- Node.js v22.20.0
- PNPM v10.18.2

---

## 🔧 Development

### Installation & Configuration

- Create .env file

```bash
cp .env.example .env
```

- Set the following environment variables in `.env`:

```env
HOST_PORT=8000
VITE_API_BASE_URL=http://localhost:3000/api
```

- Available commands

```bash
# Environment status
./bin/dev.sh

# Start development environment
./bin/dev.sh up

# Rebuild development environment
./bin/dev.sh up --build

# View logs
./bin/dev.sh logs

# Stop all containers
./bin/dev.sh down

# Stop all containers & remove all images
./bin/dev.sh remove

# Add new node package
docker compose run --rm pwa_app pnpm add package-name

# Build & Run preview server
./bin/dev.sh preview
```

---

## 🚀 Production

### Installation & Configuration

- Create .env file

```bash
cp .env.example .env.production
```

- Set the following environment variables in `.env.production`:

```env
HOST_PORT=8000
VITE_API_BASE_URL=https://your-api-domain/api
```

- Create nginx.conf file

```bash
cp ./config/nginx/nginx.conf.example ./config/nginx/nginx.conf
```

- Set production server_name in `nginx.conf`:

```env
server {
  ...
  server_name your-domain.com;
  ...
}
```

- Available commands

```bash
# Environment status
./bin/deploy.sh

# Start production
./bin/deploy.sh up

# View logs
./bin/deploy.sh logs

# Stop all containers
./bin/deploy.sh down

# Stop all containers & remove all images
./bin/deploy.sh remove
```

---

## 👨‍💻 Development with VS Code Dev Containers (Recommended)

For the best developer experience, this project is configured to use **VS Code Dev Containers**. This allows you to develop inside a fully configured Docker container directly from VS Code.

### Prerequisites

- **VS Code**
- **Docker Desktop**
- The **[Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)** extension for VS Code.

### How to Use

1.  After cloning the repository, open the project folder in VS Code.
2.  Open the **Command Palette** (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on macOS).
3.  Type **"Reopen in Container"** and select the **`Dev Containers: Reopen in Container`** command.
4.  VS Code will build the container, install the recommended extensions, and connect your editor to the development environment. This might take a few minutes on the first run.
5.  Once finished, your VS Code is now running **inside the container**. The integrated terminal (`Ctrl + `` ` ``) is a shell inside the container, ready to go.
