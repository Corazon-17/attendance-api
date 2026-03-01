#!/bin/bash

concurrently \
  -n "GATEWAY,AUTH,USER,ATTEND,AUDIT,NOTIF" \
  -c "magenta,blue,green,yellow,cyan,gray" \
  "pnpm start:dev api-gateway" \
  "pnpm start:dev auth-service" \
  "pnpm start:dev user-service" \
  "pnpm start:dev attendance-service" \
  "pnpm start:dev audit-service" \
  "pnpm start:dev notification-service"