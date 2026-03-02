# Attendance API - Backend

Backend service for Attendance System built with **NestJS Monorepo** using **Microservice Architecture**.

## 🏗 Architecture

This project consists of 5 services:

- **api-gateway** – Entry point (HTTP layer)
- **auth** – Authentication & authorization service
- **user** – User management service
- **attendance** – Attendance tracking service
- **notification** – Real-time notification service (SSE)

## ⚙️ Tech Stack

- NestJS (Monorepo)
- Microservices (TCP & RabbitMQ transport)
- PostgreSQL
- Redis
- RabbitMQ
- Prisma ORM
- Docker & Docker Compose
- Server-Sent Events (SSE) for real-time notification

---

## 📦 Infrastructure (Docker)

Docker containers used:

- PostgreSQL
- RabbitMQ
- Redis

All services are containerized and orchestrated using Docker.

---

## 🚀 Installation

```bash
cp .env.example .env
pnpm install
pnpm start:docker
pnpm setup:prisma
pnpm dev
```

### Description

- `cp .env.example .env` → Copy .env
- `pnpm install` → Install dependencies
- `pnpm start:docker` → Start all containers (PostgreSQL, RabbitMQ, Redis, etc.)
- `pnpm setup:prisma` → Run Prisma setup (generate & migrate)
- `pnpm dev` → Run development server
