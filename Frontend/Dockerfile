FROM node:14 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install md5 --save

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
