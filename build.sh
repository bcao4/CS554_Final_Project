#!/bin/bash
cd frontend
rm -rf node_modules
rm -rf package-lock.json
npm install react-scripts
npm install
npm run build
cd ..
mkdir backend/build
mv frontend/build backend/
cd backend
npm install --production
npm prune