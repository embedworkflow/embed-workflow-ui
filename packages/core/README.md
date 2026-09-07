# @embedworkflow/embed-core

Framework-agnostic core for embedding [EmbedWorkflow](https://embedworkflow.com)
UI. It's a small, typed client over the `window.EWF` runtime (loaded from the
CDN) — it does **not** bundle or implement the UI.

Most apps should use a framework package (e.g.
[`@embedworkflow/react`](https://www.npmjs.com/package/@embedworkflow/react))
instead of this directly. Use `embed-core` to build your own wrapper (Vue,
Svelte, Angular, plain JS).

## Install

```bash
npm i @embedworkflow/embed-core
```

## API

```ts
import { whenReady, isReady, mount, unmount } from "@embedworkflow/embed-core";
import type { EwfChangeDetail, EwfGlobal } from "@embedworkflow/embed-core";

// Resolve once window.EWF.mount is available (SDK loaded + EWF.load() ran).
await whenReady();

// Mount an element that already has an EWF__* class and its data-* attributes.
await mount(el);

// Tear it down (e.g. on component unmount).
unmount(el);
```

Prerequisite: the EWF loader script must be on the page and `EWF.load(publicKey,
{ jwt })` called (sign the JWT server-side). See the
[embedding guide](https://embedworkflow.com/docs).

## License

MIT
