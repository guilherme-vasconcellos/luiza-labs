# ======================================================================
# @author: Guilherme Vasconcellos <guiyllw@hotmail.com>
# @version: 1.0.0
#
# @description: Dockerfile to build challenge LuizaLabs api
# ======================================================================
FROM node:10.16-alpine

WORKDIR /app

# We use Yarn to manage dependencies and secure versions of the lock file
RUN npm i -g yarn

# Copy and install only production dependencies
COPY dist .
COPY package.json .
COPY yarn.lock .

RUN yarn install --production

ENTRYPOINT [ "node", "app.js" ]
