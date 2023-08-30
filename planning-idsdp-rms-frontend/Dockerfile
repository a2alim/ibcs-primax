# Stage 1 - Build React App inside temporary Node container
# FROM node:carbon-alpine as react-build
FROM node:14.20-alpine as builder

ARG MAX_OLD_SPACE_SIZE=16224
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

WORKDIR /usr/src/app
COPY . ./
RUN npm cache clean --force
RUN npm install --force && npm install -g @angular/cli
RUN ng build --prod --aot --build-optimizer

# Stage 2 - Deploy with NGNIX
FROM nginx:1.15.2-alpine

COPY --from=builder /usr/src/app/dist/fuse /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]
