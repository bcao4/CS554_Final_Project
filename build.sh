#!/bin/bash
cd frontend
rm -rf node_modules
rm -rf package-lock.json
npm uninstall react-scripts
npm install -g react-scripts
npm install
npm install react@alpha react-dom@alpha
npm run build
cd ..
mkdir backend/build
mv frontend/build backend/
cd backend
npm install --production
npm prune