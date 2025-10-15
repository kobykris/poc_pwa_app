# PWA Push Notification PoC
A Proof of Concept (PoC) project demonstrating Progressive Web App (PWA) capabilities, focusing on Web Push Notifications.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, React Router
- **PWA:** `vite-plugin-pwa` with Workbox
- **Push Service:** `web-push` library (VAPID)
- **DevOps:** Docker, Docker Compose

---

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- **Docker** and **Docker Compose**: The project is fully containerized. Please install Docker for your OS.
- **Node.js** and **PNPM** are **NOT** required on your host machine as they are managed within the Docker container.

### 1. Project Setup

First, clone the repository to your local machine:

```bash
git clone <your-repository-url>
cd <your-repository-name>
```

### 2. Environment Configuration

The project uses environment variables for configuration.

1.  **Copy the example environment file:**
    ```bash
    cp .env.example .env
    ```

2.  **Update your `.env` file:**
    Open the `.env` file and fill in the variables.

    ```env
    # --- Server Configuration ---
    # Port for the Node.js inside the container
    PORT=3000
    
    # Port to expose the dev server on the host machine
    HOST_PORT=3000
    
    # Base URL for the backend API, accessible from the frontend
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

### 3. Running the Application

Everything is managed through Docker Compose.

1.  **Build and Start Services:**
    This command will build the Docker images and start service in the background.
    ```bash
    docker compose up --build -d
    ```

2.  **Accessing the Services:**
    -   **PWA Frontend:** Open your browser and navigate to `http://localhost:8000` (or the port you configured for the frontend).

### 4. Stopping the Application

To stop all running containers, use the following command:
```bash
docker compose down
```

---

## 🔧 Useful Docker Commands

- **View Logs:**
  ```bash
  # View logs for all services
  docker compose logs -f

  # View logs for a specific service (e.g., pwa_app)
  docker compose logs -f pwa_app
  ```

- **Run One-off Commands:**
  To run commands inside a container, like installing a new package.
  ```bash
  # Example: Install a new package in the frontend
  docker compose run --rm pwa_app pnpm add package-name

- **Access Container Shell:**
  ```bash
  docker compose exec pwa_app sh
  ```

  ---

## 👨‍💻 Development with VS Code Dev Containers

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

### Running the Services in Dev Container

Because the Dev Container is already running, you don't need `docker compose up`. Instead, you can manage services directly from the VS Code terminal.