FROM node:14-alpine as base

FROM base as bild
WORKDIR /build
COPY . .
RUN npm i
RUN npm run build
RUN npm prune --production

FROM base
WORKDIR /app
COPY --from=bild /build/node_modules ./node_modules
COPY --from=bild /build/dist ./dist
COPY . .
ENV PRODUCT=https://pp6vr2duqa.execute-api.eu-west-1.amazonaws.com/dev
ENV CART=http://chermic-cart-api-dev.eu-west-1.elasticbeanstalk.com/api
EXPOSE 4000
ENTRYPOINT [ "npm", "run", "start:prod" ]