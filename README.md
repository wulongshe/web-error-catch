# WEB ERROR CATCH

## 💡 Description

> 在无source map的生产环境中，将web error信息交由server端正确处理

## 🚀 Features

- 生产环境无需暴露`source map`，避免安全问题
- `web`产生的`error`信息，交由`server`端正确处理

## 📦 Install

```bash
# sdk
npm i @dt-wec/sdk
# vite plugin
npm i -D @dt-wec/plugin-vite
# webpack plugin
npm i -D @dt-wec/plugin-webpack
```

## ⚡ Quick Start Dev

```bash
# entry project
cd web-error-catch
# install dependencies
pnpm i
# build all
pnpm build

# start react app
cd examples/react-app
pnpm preview

# or start vue app
cd examples/vue-app
pnpm preview

# start server
cd packages/server
pnpm dev

# add and commit code
pnpm ac
```

## 🦄 Usage

### plugin webpack

```ts
import UploadSourceMapPlugin from '@dt-wec/plugin-webpack';
import type { Configuration } from 'webpack';

const config: Configuration = {
  // ...others config
  plugins: [
    new UploadSourceMapPlugin({
      url: 'https://example.com/upload/source-map',
    }),
  ],
};

export default config;
```

### plugin vite

```ts
import { defineConfig } from 'vite';
import UploadSourceMapPlugin from '@dt-wec/plugin-vite';

export default defineConfig({
  // ...others config
  plugins: [
    UploadSourceMapPlugin({
      url: 'https://example.com/upload/source-map',
    }),
  ],
});
```

### sdk

```ts
import { register } from '@dt-wec/sdk';

register({
  url: 'https://example.com/report/error',
});
```

### server

```bash
cd packages/server
# build
npm run build
# run
node dist/index.js
  --port 8000 # default 8000
  --method POST # default GET
  --url https://example.com/track

# check log on http://localhost:8000/report.log or http://localhost:8000/report.json
```

## 🔑 Server API

### upload source map

```ts
interface UploadSourceMap {
  method: 'POST';
  url: '/upload/source-map';
  body: { [filename: string]: string }
}
```

### report error information

```ts
interface ReportErrorGet {
  method: 'GET';
  url: '/report/error';
  query: {
    meta: string;
    stack: string;
  };
}
interface ReportErrorPost {
  method: 'POST';
  url: '/report/error';
  body: ArrayBuffer<{
    meta: string;
    stack: string;
  }>;
}
```

## 📄 License

[MIT License](https://github.com/shewulong/web-error-catch/blob/master/LICENSE.md) © 2023 [shewulong](https://github.com/shewulong)
