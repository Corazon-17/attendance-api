#!/bin/bash

echo "Starting Prisma setup..."

npx concurrently \
  --names "USER,ATTEND,AUDIT" \
  --prefix-colors "magenta,blue,cyan" \
  --kill-others-on-fail \
  "cd apps/user-service && npx prisma generate && npx prisma db seed" \
  "cd apps/attendance-service && npx prisma generate" \
  "cd apps/audit-service && npx prisma generate"

echo "Prisma setup complete."