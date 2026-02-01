#!/bin/bash

echo "Starting Java backend..."
cd backend && mvn spring-boot:run &

echo "Starting Next.js frontend..."
cd ../frontend && npm run dev &

wait
