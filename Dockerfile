FROM node:16-alpine3.14

ARG SERVER_DIR=/opt/server
ARG CLIENT_DIR=/opt/client
ARG TEMP=/opt/temp

RUN mkdir -p ${CLIENT_DIR} ${TEMP}

COPY client/ ${CLIENT_DIR}/
COPY server/ ${TEMP}/

RUN cd /opt && \
    npx express-generator --no-view server && \
    cd ${SERVER_DIR} && \
    rm -rf public && \
    mv ${TEMP}/* ${SERVER_DIR} && \
    npm install && \
    cd ${CLIENT_DIR} && \
    npm install && \
    npm run build && \
    mv dist/ ${SERVER_DIR}

WORKDIR ${SERVER_DIR}

ENTRYPOINT [ "npm", "run", "start:prod" ]