FROM node:16
WORKDIR /app

COPY app.js .
CMD ["app.js"]
