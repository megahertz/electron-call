# electron-call
[![Tests](https://github.com/megahertz/electron-call/workflows/Tests/badge.svg)](https://github.com/megahertz/electron-call/actions?query=workflow%3ATests)
[![npm version](https://img.shields.io/npm/v/electron-call?color=brightgreen)](https://www.npmjs.com/package/electron-call)
[![Dependencies status](https://img.shields.io/david/megahertz/electron-call)](https://david-dm.org/megahertz/electron-call)

The easiest main-renderer IPC communication. Now calling a method/function in a
remote process looks the sames as calling a local. Supports both main - renderer
and renderer - main calls. Renderer - renderer is on the roadmap.

Warning: API could be changes frequently until v0.1.0 release.

### Key features

 - Very simple API
 - Typescript friendly
 - Lightweight and fast
 - No dependencies

```typescript
// MainApi.ts
import { app } from 'electron';
import call from 'electron-call';

export class MainApi {
  async getAppName() {
    return app.getName();
  }
}

call.provide('MainApi', MainApi);
```

```typescript
// renderer.ts
import call from 'electron-call';
import type { MainApi } from '../main/MainApi';

const mainApi = call.use<MainApi>('MainApi')
console.log(await mainApi.getAppName());
```

## Installation

Install with [npm](https://npmjs.org/package/electron-call):

    npm install electron-call

## Usage

### Provide API

There are 3 ways of defining API:

#### Using a class

Preferred way, since it provides the best type support

```typescript
export class FsApi {
  async selectDirectory(defaultPath: string) {
    return dialog.showOpenDialog({
      defaultPath,
      properties: ['openDirectory'],
    });
  }
}

call.provide('FsApi', new FsApi());
```

#### Using an object

It works the same as above, but there's a lack of types. That's fine if you
don't use TypeScript or prefer a separated interface for ApiName

```js
call.provide('FsApi', {
  async selectDirectory(defaultPath) {
    return dialog.showOpenDialog({
      defaultPath,
      properties: ['openDirectory'],
    });
  },
});
```

#### Using a function

```js
call.provideFunction('selectDirectory', async (defaultPath) => {
  return dialog.showOpenDialog({
    defaultPath,
    properties: ['openDirectory'],
  });
});
```

### Use API

#### Using a class/object

You can omit using FsApi generic if you don't need type support

```typescript
const fsApi = call.use<FsApi>('FsApi')
console.log(await fsApi.selectDirectory(defaultPath));
```

#### Using a function

```js
const selectDirectory = call.use('selectDirectory')
console.log(await selectDirectory(defaultPath));
```
