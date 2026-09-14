# @embedworkflow/vue

Vue 3 components for embedding [EmbedWorkflow](https://embedworkflow.com) UI into
your own app. Thin wrappers over the EWF runtime (loaded from the CDN) — Vue and
the runtime are **not** bundled.

## Install

```bash
npm i @embedworkflow/vue
```

`vue >= 3.3` is a peer dependency.

## Prerequisites

The EWF loader script must be on the page, and auth established once (sign the JWT
**server-side**). Prefer the exported `load()` over `window.EWF.load` — it retries
through the loader's brief startup gap so a fast call isn't dropped:

```ts
import { load } from "@embedworkflow/vue";
load(pkToken, { jwt });
```

See the [embedding guide](https://embedworkflow.com/docs). Components wait for the
runtime internally — no readiness code needed.

## Components

One component per embeddable renderer:

| Component | Renders | Key props |
| --- | --- | --- |
| `EwfApp` | The full workflow builder / app | `base-path` |
| `EwfSettingsForm` | A workflow's client settings form | `workflow-id` \| `workflow-key` |
| `EwfConnections` | The managed connections UI | — |
| `EwfField` | A single field from a workflow's form | `workflow-id`\|`workflow-key`, `field-id`, `default-value`; emits `change` |

### `EwfField`

```vue
<script setup lang="ts">
import { EwfField, type EwfChangeDetail } from "@embedworkflow/vue";
const onChange = (d: EwfChangeDetail) => console.log(d.value, d.option);
</script>

<template>
  <EwfField workflow-id="wf_123" field-id="slack" @change="onChange" />
</template>
```

The `change` event carries `EwfChangeDetail` — `{ fieldId, value, option? }`.

### `EwfApp`

```vue
<EwfApp base-path="workflows" style="height: calc(100vh - 60px)" />
```

- `base-path` has **no leading slash** (the renderer adds it).
- Give it an **explicit, non-percentage height** (a `%` height collapses to 0).
- The app does client-side routing under `base-path`, so add a **catch-all route**
  in vue-router: `{ path: "/workflows/:pathMatch(.*)*", component: … }`.

## `EwfEmbed` — escape hatch / forward-compat

Embed any renderer by name, including ones this package version has no typed
component for yet. It works for whatever the **loaded CDN runtime** supports, so a
renderer newly shipped in the SDK is usable without upgrading this package.

```vue
<EwfEmbed name="reports" :data="{ 'base-path': 'reports' }" @change="..." />
<!-- → <div class="EWF__reports" data-base-path="reports"> -->
```

- `name` — renderer class suffix (`"reports"` → `EWF__reports`).
- `data` — keys map to `data-<key>`.

Prefer the named components when they exist. (They're built on top of `EwfEmbed`
via `createEmbed`, also exported if you want to define your own.)

> Note: the named components declare props at runtime, so editor template
> type-checking won't autocomplete prop names — they bind correctly at runtime.

## License

MIT
