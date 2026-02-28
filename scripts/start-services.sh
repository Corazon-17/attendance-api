#!/bin/bash

function shutdown {
    echo "Shutting down all services..."
    kill $(jobs -p)
    wait
    echo "All services have been stopped."
}

trap shutdown SIGINT SIGTERM

echo "Starting all services..."

pnpm start:dev api-gateway &
echo "API Gateway started"

pnpm start:dev auth-service &
echo "Auth Service started"

pnpm start:dev user-service &
echo "User Service started"

pnpm start:dev attendance-service &
echo "Attendance Service started"

pnpm start:dev audit-service &
echo "Audit Service started"

wait
echo "All services stopped."