# Distributed Food Ordering System

Comprehensive monorepo for a microservices-based food ordering platform. It includes a React/Vite frontend and four Node.js microservices for Restaurant, Ordering, Delivery, and Payment, plus Redis, Docker Compose, and Kubernetes manifests for deployment.

This README covers project overview, architecture, local development, Docker, Kubernetes, environment variables, and troubleshooting.

## Overview

- Frontend: `food_ordering_system` (React + Vite, TailwindCSS, React Router, React Query)
- Microservices (Node.js, Express, Mongoose):
  - `restaurant_service` (port 5001/5002)
  - `payment_service` (port 5001/5002)
  - `delivery_service` (port 5000)
  - `ordering_service` (port 5003 or 3000 in `.env`)
- Realtime: Socket.IO across services
- Data: MongoDB Atlas
- Cache/Queue: Redis (alpine)
- Orchestration: Docker Compose for local multi-service dev, Kubernetes manifests in `k8s/` for cluster deployment

## Architecture

```
												 +-------------------+
												 |   React Frontend  |
												 |  Vite @5173 (web) |
												 +---------+---------+
																	 |
										 REST/Socket.IO|                Push (Web-Push)
																	 |                      |
			+--------------+-------------+-------+--------------+-----------+
			|              |                     |                          |
 +----v----+   +-----v------+        +-----v------+              +----v-----+
 |Delivery |   |Ordering    |        |Restaurant  |              |Payment   |
 |Service  |   |Service     |        |Service     |              |Service   |
 |@5000    |   |@5003/3000  |        |@5001/5002  |              |@5001/5002|
 +----+----+   +-----+------+        +-----+------+              +----+-----+
			|              |                      |                         |
			|              |                      |                         |
			+--------------+----------+-----------+-------------------------+
																 |
															 Redis
																 |
															MongoDB
```

Notes:

- Ports vary between `.env`, Docker Compose, and K8s. See the Environment Variables section.
- Frontend reads service URLs from `food_ordering_system/.env` via `VITE_*` variables.

## Repository Structure

- `food_ordering_system/`: React app (Vite). Dockerfile exposes `5173`.
- `microservices/`
  - `delivery_service/`: Express, Socket.IO, Redis, MongoDB (`PORT=5000`).
  - `ordering_service/`: Express, Stripe, MongoDB (`.env PORT=3000`, Docker/K8s `5003`).
  - `payment_service/`: Express, Stripe, Web Push (`PORT=5002`).
  - `restaurant_service/`: Express, uploads/static, reviews (`.env PORT=5001`, K8s `5002`).
- `k8s/`: ConfigMaps, Deployments, Services for all components.
- `docker-compose.yaml`: Local dev orchestration.

## Prerequisites

- Node.js 18+ and npm
- Docker Desktop (for Compose)
- Kubernetes cluster (optional for k8s; e.g., Docker Desktop Kubernetes or Minikube)
- MongoDB Atlas connection strings set in microservice `.env` files

## Quick Start (Local)

1. Install frontend deps

```
cd ./food_ordering_system
npm install
```

2. Configure frontend env (`food_ordering_system/.env`) — already present:

```
VITE_GOOGLE_API=...
VITE_MAP_ID=...
VITE_DELIVERY_SERVICE_PREFIX=http://localhost:5000
VITE_PAYMENT_SERVICE_PREFIX=http://localhost:5002
VITE_RESTAURANT_SERVICE_PREFIX=http://localhost:5001
VITE_ORDERING_SERVICE_PREFIX=http://localhost:5003
VITE_VAPID_PUBLIC_KEY=...
```

3. Configure backend envs (already present in each service folder). Ensure MongoDB URLs and secrets are valid:

- `microservices/delivery_service/.env` (PORT 5000)
- `microservices/payment_service/.env` (PORT 5002)
- `microservices/restaurant_service/.env` (PORT 5001; K8s uses 5002)
- `microservices/ordering_service/.env` (PORT 3000; Docker/K8s use 5003)

4. Run services locally (separate terminals):

```
# Delivery
cd ./microservices/delivery_service; npm install; npm start

# Payment
cd ./microservices/payment_service; npm install; npm start

# Restaurant
cd ./microservices/restaurant_service; npm install; npm start

# Ordering (ensure it binds 5003 if matching frontend)
cd ./microservices/ordering_service; npm install; npm start

# Frontend (new terminal)
cd ./food_ordering_system; npm run dev
```

Visit `http://localhost:5173`.

## Docker Compose (Recommended for local multi-service)

Compose builds all containers and wires ports/env automatically.

```
docker compose up --build
```

Services and ports (host:container):

- `web` (frontend): `5173:5173`
- `delivery_service`: `5000:5000`
- `payment_service`: `5002:5002`
- `restaurant_service`: `5001:5001`
- `ordering_service`: `5003:5003`
- `redis`: `6379:6379`

Frontend env file path used by Compose: `./food_ordering_system/.env`

## Kubernetes (Optional)

Manifests in `k8s/` provide ConfigMaps, Deployments, and Services.

Build images locally and load to your cluster (example for Minikube):

```
minikube start
eval $(minikube docker-env)

# Build images with tags matching manifests
docker build -t web:latest ./food_ordering_system
docker build -t delivery-service:latest ./microservices/delivery_service
docker build -t ordering-service:latest ./microservices/ordering_service
docker build -t payment-service:latest ./microservices/payment_service
docker build -t restaurant-service:latest ./microservices/restaurant_service

# Apply manifests
kubectl apply -f k8s/

# Access frontend (NodePort)
kubectl get svc web
```

Adjust ConfigMaps as needed for secrets (consider Kubernetes Secrets for JWT/Stripe keys). The frontend ConfigMap sets `VITE_*` variables.

## Environment Variables

Frontend (`food_ordering_system/.env`):

- `VITE_DELIVERY_SERVICE_PREFIX`, `VITE_PAYMENT_SERVICE_PREFIX`, `VITE_RESTAURANT_SERVICE_PREFIX`, `VITE_ORDERING_SERVICE_PREFIX` — service base URLs.
- `VITE_GOOGLE_API`, `VITE_MAP_ID` — Google Maps.
- `VITE_VAPID_PUBLIC_KEY` — Web Push.

Backend examples:

- `delivery_service`: `PORT`, `DB_URL`, `JWT_SECRET`, `FRONTEND_PREFIX`, `GOOGLE_API`, optional Redis.
- `payment_service`: `PORT`, `DB_URL`, `JWT_SECRET`, `STRIPE_SECRET`, `STRIPE_PUBLISHABLE_KEY`, `VAPID_*`, `FRONTEND_PREFIX`.
- `restaurant_service`: `PORT`, `DB_URL`, `JWT_SECRET`, `FRONTEND_PREFIX`.
- `ordering_service`: `PORT` (use 5003 to match frontend), `MONGO_DB_URL`, `JWT_SECRET`, `FRONTEND_PREFIX`, `STRIPE_SECRET`.

## Tech Stack

- Frontend: React 19, Vite, TailwindCSS, React Router, React Query, Stripe, Google Maps.
- Backend: Node.js, Express, Mongoose, Socket.IO, Redis.
- Infra: Docker, Kubernetes, MongoDB Atlas.

## Common Tasks

- Lint frontend: `cd food_ordering_system; npm run lint`
- Build frontend: `cd food_ordering_system; npm run build`
- Preview build: `cd food_ordering_system; npm run preview`

## Troubleshooting

- Port mismatch: Ensure frontend env URLs match running service ports.
- CORS: Backends use `FRONTEND_PREFIX`; set to `http://localhost:5173` for local.
- MongoDB connection: Verify Atlas credentials; firewall allows your IP.
- Redis: Compose starts `redis`; set service Redis host/port if using.
- Kubernetes images: Use `imagePullPolicy: Never` with locally built images in Minikube.
- Stripe keys: Must be valid to create payment intents; check `payment_service` env.

## Security

- Do not commit real secrets. Move sensitive values to `.env` and Kubernetes Secrets.
- Rotate API keys regularly and restrict scopes.

## License

Proprietary or project-specific. Add a license if needed.

