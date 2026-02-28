#!/bin/bash

echo "Shutting down services..."
docker compose down || exit 1
echo "All services stopped."
colima stop || exit 1
echo "Stopping Docker services..."