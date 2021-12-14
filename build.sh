#!/bin/bash
cd frontend
rm -rf node_modules
rm -rf package-lock.json
npm i -g yarn
yarn global add react-scripts
yarn run build
cd ..
mkdir backend/build
mv frontend/build backend/
cd backend
yarn install
