#  Full Stack Realtime Chat App 

- Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI

## CI/CD with GitHub Actions and a Self‑Hosted Server

This project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`)
that compiles both frontend and backend on every push to `main` and then
deploys the application to an nginx‑equipped Linux host over SSH. There is
no cloud provider involved – you simply need a machine reachable from GitHub
with Docker and Docker Compose installed.

### Workflow overview

1. **Build job**
   * checks out source code
   * installs Node dependencies in `backend/` and `frontend/`
   * optionally runs tests and lints the code
   * builds the React/Vite frontend into `frontend/dist`

2. **Deploy job**
   * re-checks out the repo (including the freshly generated `dist`)
   * copies all files to the remote server using `scp`
   * logs in with `ssh` and invokes `docker-compose up -d --build`
     in the project directory, recreating containers with the new build.

### Required repository secrets

Set the following in **Settings → Secrets → Actions**:

* `SERVER_HOST` – remote host IP or hostname
* `SERVER_USER` – SSH username
* `SERVER_SSH_KEY` – private key for that user
* `SERVER_SSH_PORT` – (optional) SSH port, default 22
* `SERVER_PROJECT_PATH` – path on the server where the project should live

The workflow uses the community `appleboy/scp-action` and
`appleboy/ssh-action` to handle file transfer and remote command execution.

### Server preparation

On the target machine:

1. Install Docker & Docker Compose.
2. Create the directory indicated by `SERVER_PROJECT_PATH`.
3. (Optional) clone the repository there or let the workflow copy it on the first
   deployment.
4. Populate `backend/.env` (and any other configuration) with production values –
   the workflow does not sync environment variables.

With these steps done, each push to `main` triggers a rebuild and deploy
of the chat application.


