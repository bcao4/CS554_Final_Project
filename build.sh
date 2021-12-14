#!/bin/bash
cd frontend
npm install
npm run build
cd ..
mkdir backend/build
mv frontend/build backend/
cd backend
npm install --production
npm prune