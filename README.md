# electron-call
[![Tests](https://github.com/megahertz/electron-call/workflows/Tests/badge.svg)](https://github.com/megahertz/electron-call/actions?query=workflow%3ATests)
[![npm version](https://img.shields.io/npm/v/electron-call?color=brightgreen)](https://www.npmjs.com/package/electron-call)
[![Dependencies status](https://img.shields.io/david/megahertz/electron-call)](https://david-dm.org/megahertz/electron-call)

## Description

The easiest main-renderer IPC communication

The project is at an early stage.

```typescript
// MainApi.ts
import { app } from 'electron';
import call from 'electron-call';

class MainApi {
  async getAppName() {
    return app.getName();
  }
}

call.provide(MainApi);
```

```typescript
// renderer.ts
import call from 'electron-call';
import type { MainApi } from '../main/MainApi';

const mainApi = call.use<MainApi>()
console.log(await mainApi.getAppName());
```

```typescript
// RendererApi.ts
import call from 'electron-call';

class RendererApi {
  async renderText(text: string) {
    document.getElementById('text').innerText = text;
  }
}

call.provide(RendererApi);
```

## Installation

Install with [npm](https://npmjs.org/package/electron-call):

    npm install electron-call



