FROM node:16
COPY . .
ENV NODE_ENV=production
RUN bash build.sh

# heroku will set PORT env variable to use and not honor this port, this is for local testing
EXPOSE 4000

WORKDIR /backend
CMD ["npm", "start"]