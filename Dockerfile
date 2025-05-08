FROM node:12.21.0

WORKDIR /

COPY . .

RUN npm install
RUN npm run build
RUN mkdir -p dist/ctpuzzle-tangram

RUN sh -c 'mv dist/* dist/ctpuzzle-tangram/ || true'
CMD ["npx", "http-server", "dist"]
