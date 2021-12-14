#!/bin/bash
cd frontend
rm -rf node_modules
rm -rf package-lock.json
npm i -g yarn
yarn uninstall react-scripts
yarn install -g react-scripts
yarn install
yarn run build
cd ..
mkdir backend/build
mv frontend/build backend/
cd backend
yarn install --production
yarn prune