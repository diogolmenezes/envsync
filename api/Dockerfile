FROM node:16-alpine3.12

ARG diretorio=/usr/src

RUN mkdir -p $diretorio

WORKDIR $diretorio

COPY . $diretorio

RUN npm install

EXPOSE 8090

CMD node index.js