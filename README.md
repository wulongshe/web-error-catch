# WEB ERROR CATCH

## 💡 Description

> 在无source map的生产环境中，将web error信息交由server端正确处理

## 🚀 Features

- 生产环境无需暴露`source map`，避免安全问题
- `web`产生的`error`信息，交由`server`端正确处理

## 📦 Install

```bash
# web
npm i @error-catch/web
# plugin
npm i -D @error-catch/plugin
```

## ⚡ Quick Start Dev

```bash
# entry project
cd web-error-catch
# install dependencies
pnpm i

# start server
cd packages/server
pnpm dev

# commit code
pnpm cz
# add and commit code
pnpm ac
```

## 🦄 Usage

### plugin

```ts
import UploadSourceMapPlugin from '@error-catch/plugin';

export default {
  // ...其他配置项
  plugins: [
    new UploadSourceMapPlugin({
      url: 'https://example.com/source-maps',
    }),
  ],
};
```

## 🔑 API

```ts
```

## 📄 License

[MIT License](https://gitlab.com/shewulong/web-error-catch/blob/master/LICENSE.md) © 2023 [shewulong](https://gitlab.com/shewulong)
