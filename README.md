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

class MainApi {
  async getAppName() {
    return app.getName();
  }
}

call.provide('main', MainApi);
```

```typescript
// renderer.ts
import call from 'electron-call';
import type { MainApi } from '../main/MainApi';

const mainApi = call.use<MainApi>('main')
console.log(await mainApi.getAppName());
```

## Installation

Install with [npm](https://npmjs.org/package/electron-call):

    npm install electron-call



