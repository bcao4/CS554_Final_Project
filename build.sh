#!/bin/bash
cd frontend
rm -rf node_modules
rm -rf package-lock.json
npm uninstall react-scripts
npm install -g react-scripts@^4
npm install eslint-config-react-app
npm install
npm run build
cd ..
mkdir backend/build
mv frontend/build backend/
cd backend
npm install --production
npm prune