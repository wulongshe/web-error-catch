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
# server
npm i -g @dt-wec/server
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

export default <Configuration>{
  // ...others config
  plugins: [
    new UploadSourceMapPlugin({
      url: 'https://example.com/upload',
    }),
  ],
};
```

### plugin vite

```ts
import { defineConfig } from 'vite';
import UploadSourceMapPlugin from '@dt-wec/plugin-vite';

export default defineConfig({
  // ...others config
  plugins: [
    UploadSourceMapPlugin({
      url: 'https://example.com/upload',
    }),
  ],
});
```

### sdk

```ts
import { register } from '@dt-wec/sdk';

register({
  url: 'https://example.com/report',
});
```

### server

```bash
# default port 8080
pnpm serve
# or docker
sh deploy.sh
```

## 🔑 Server API

### upload source map

```ts
interface UploadQuery {
  project: string;
  timestamp: number;
}
interface UploadSourceMap {
  method: 'POST';
  url: '/upload';
  query: UploadQuery;
  body: FormData; // field: 'file'
  headers: { 'content-type': 'multipart/form-data' };
}
```

### report error information

```ts
interface ReportParams {
  stack: string;
  context_lines?: number;
}
interface ReportErrorGet {
  method: 'GET';
  url: '/report';
  query: ReportParams;
}
interface ReportErrorPost {
  method: 'POST';
  url: '/report';
  headers: { 'Content-Type': 'text/plain;charset=UTF-8' };
  body: ReportParams;
}
```

## 📄 License

[MIT License](https://github.com/wulongshe/web-error-catch/blob/master/LICENSE.md) © 2023 [shewulong](https://github.com/wulongshe)
