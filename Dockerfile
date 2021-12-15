FROM node:16
COPY . .
ENV NODE_ENV=production
RUN bash build.sh
EXPOSE 4000
WORKDIR /backend
CMD ["npm", "start"]