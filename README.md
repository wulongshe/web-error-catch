# WEB ERROR CATCH

## 💡 Description

> 在无source map的生产环境中，将web error信息交由server端正确处理

## 🚀 Features

- 生产环境无需暴露`source map`，避免安全问题
- `web`产生的`error`信息，交由`server`端正确处理

## 📦 Install

```bash
# sdk
npm i @wec/sdk
# vite plugin
npm i -D @wec/plugin-vite
# webpack plugin
npm i -D @wec/plugin-webpack
```

## ⚡ Quick Start Dev

```bash
# entry project
cd web-error-catch
# install dependencies
pnpm i

# start web
cd examples/web
pnpm dev

# start server
cd packages/server
pnpm dev

# add and commit code
pnpm ac
```

## 🦄 Usage

### plugin webpack

```ts
import UploadSourceMapPlugin from '@wec/plugin-webpack';
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
import UploadSourceMapPlugin from '@wec/plugin-vite';

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
import { initialize } from '@wec/sdk';

initialize({
  url: 'https://example.com/report/error',
});
```

### server

```bash
cd packages/server
# build
npm run build
# default port 6000
node dist/index.js --port 8080
```

## 🔑 Server API

### upload source map

```ts
interface UploadSourceMap {
  method: 'POST';
  url: '/upload/source-map';
  query: {
    filename: string;
  };
  body: File;
  header: {
    'Content-Type': 'multipart/form-data';
  }
}
```

### report error information

```ts
interface ReportError {
  method: 'GET';
  url: '/report/error';
  query: {
    meta: {};
    error: {};
  };
}
```

## 📄 License

[MIT License](https://gitlab.com/shewulong/web-error-catch/blob/master/LICENSE.md) © 2023 [shewulong](https://gitlab.com/shewulong)
