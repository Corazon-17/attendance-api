#!/bin/bash
echo "Starting Colima..."
colima start || exit 1
echo "Starting Docker services..."
docker compose up -d || exit 1
echo "All services started."