FROM node:16
COPY . .
ENV NODE_ENV=production
RUN bash build.sh
EXPOSE 4000
CMD ["npm", "start"]