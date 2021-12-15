FROM node:16
WORKDIR /app
COPY . .
ENV NODE_ENV=production

WORKDIR /app/frontend
RUN npm install -g react-scripts
RUN npm install
RUN npm run build

WORKDIR /app
RUN mkdir backend/build
RUN mv frontend/build backend/
RUN rm -rf frontend

WORKDIR /app/backend
RUN npm install --production

# heroku will set PORT env variable to use and not honor this port, this is for local testing
EXPOSE 4000

CMD ["npm", "start"]