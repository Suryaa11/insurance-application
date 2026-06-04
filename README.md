# Insurance Management Application

Production-ready full-stack insurance workflow platform with React, Express, MongoDB, JWT auth, document uploads, reporting, and Docker deployment.

## Architecture

```text
React + Vite + MUI
        |
        v
Express / JWT / Multer / Winston
        |
        v
MongoDB + Mongoose
        |
        v
Azure Blob Storage for document files
```

## Features

- Customer registration and login with JWT + refresh token support
- Role-based access control for `CUSTOMER` and `ADMIN`
- Insurance plan browsing and application submission
- Document upload, review, verification, rejection, and replacement
- Azure Blob Storage for document files, with MongoDB storing only metadata
- Admin dashboards, reports, search, filtering, and pagination
- Notification feed for application and document events
- Winston request and error logging
- Dockerized frontend, backend, and MongoDB

## Folder Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── constants
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── seed
├── frontend
│   └── src
│       ├── api
│       ├── components
│       ├── context
│       ├── layouts
│       ├── pages
│       └── theme
├── docker-compose.yml
├── API.md
└── README.md
```

## API Endpoints

See [API.md](API.md) for the full endpoint list and response format.

## Local Setup

1. Install dependencies:
   ```bash
   npm install --workspaces
   ```
2. Copy env files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Start MongoDB locally or via Docker.
4. Set Azure Blob env vars in `backend/.env` for document uploads:
   - `AZURE_STORAGE_CONNECTION_STRING`
   - `AZURE_STORAGE_CONTAINER_NAME`
5. Seed sample data:
   ```bash
   npm run seed --workspace backend
   ```
6. Run backend:
   ```bash
   npm run dev --workspace backend
   ```
7. Run frontend:
   ```bash
   npm run dev --workspace frontend
   ```
8. Or start everything from one script on Windows:
   ```powershell
   .\start-local.ps1
   ```
9. Stop the local app:
   ```powershell
   .\stop-local.ps1
   ```

The local launcher seeds the sample admin user and insurance plans automatically.
The backend also seeds the same default admin and plans automatically on application startup, so fresh databases are initialized without manual steps.

## Seeded Admin

- Email: `admin@insurance.com`
- Password: `Admin@12345`

## Docker Setup

1. Build and start everything:
   ```bash
   docker compose up --build
   ```
2. Open:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`
   - Health: `http://localhost:5000/health`

## Production Deployment

- Set strong JWT secrets and a production MongoDB URI.
- Build images with `docker compose build`.
- Use a reverse proxy such as Nginx or a cloud load balancer in front of ports `3000` and `5000`.
- Run the backend with `NODE_ENV=production`.
- Store uploaded documents on persistent storage if you move beyond local Docker volumes.

## Troubleshooting

- If login fails, confirm the backend is connected to MongoDB and seeded.
- If uploads fail, ensure the Azure Blob connection string and container name are set correctly.
- If uploads fail after moving to Azure, confirm the blob connection string and container name are set.
- If CORS errors appear, set `CLIENT_ORIGIN` to the exact frontend origin.
- If the frontend cannot reach the API in Docker, verify `VITE_API_URL` and compose networking.

## Notes

- Public plan browsing is enabled.
- Admin-only reports and dashboards require an authenticated admin token.
