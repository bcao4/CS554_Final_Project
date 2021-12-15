#!/bin/bash
cd frontend
rm -rf node_modules
rm -f package-lock.json
npm install -g react-scripts
npm install
npm run build
cd ..
mkdir backend/build
mv frontend/build backend/
rm -rf frontend
cd backend
npm install --production
