FROM node:alpine
WORKDIR /api

ARG DATABASE_URL
ARG PORT
ARG APP_URL
ARG SESSION_SECRET
ARG LOGIN_ADMIN
ARG PASSWORD_ADMIN


ENV DATABASE_URL = ${DATABASE_URL}
ENV PORT = ${PORT}
ENV APP_URL = ${APP_URL}
ENV SESSION_SECRET = ${SESSION_SECRET}
ENV LOGIN_ADMIN = ${LOGIN_ADMIN}
ENV PASSWORD_ADMIN = ${PASSWORD_ADMIN}
ENV TZ = ${TZ}



COPY /api/package.json package.json
RUN npm install
COPY /api .

CMD ["sh", "-c", "npm run migrate:up && npm start"]