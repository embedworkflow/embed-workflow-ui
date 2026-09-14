# @embedworkflow/react

React components for embedding [EmbedWorkflow](https://embedworkflow.com) UI into
your own app. Thin wrappers over the EWF runtime (loaded from the CDN) — React
and the runtime are **not** bundled.

## Install

```bash
npm i @embedworkflow/react
```

`react >= 17` is a peer dependency.

## Prerequisites

The EWF loader script must be on the page, and auth established once (sign the JWT
**server-side**). Prefer the exported `load()` over `window.EWF.load` — it retries
through the loader's brief startup gap so a fast call isn't dropped:

```tsx
import { load } from "@embedworkflow/react";
load(pkToken, { jwt });
```

See the [embedding guide](https://embedworkflow.com/docs). Components wait for the
runtime internally — no readiness code needed.

## Components

One component per embeddable renderer:

| Component | Renders | Key props |
| --- | --- | --- |
| `EwfApp` | The full workflow builder / app | `basePath` |
| `EwfSettingsForm` | A workflow's client settings form | `workflowId` \| `workflowKey` |
| `EwfConnections` | The managed connections UI | — |
| `EwfField` | A single field from a workflow's form | `workflowId`\|`workflowKey`, `fieldId`, `defaultValue`; emits `onChange` |

All accept `className` and `style`.

### `EwfField`

```tsx
import { EwfField } from "@embedworkflow/react";

<EwfField
  workflowId="wf_123"        // or workflowKey="onboarding"
  fieldId="slack"            // field name or id in the workflow's form
  onChange={(e) => console.log(e.value, e.option)}
/>;
```

`onChange` receives `EwfChangeDetail` — `{ fieldId, value, option? }`.

### `EwfApp`

```tsx
<EwfApp basePath="workflows" style={{ height: "calc(100vh - 60px)" }} />
```

- `basePath` has **no leading slash** (the renderer adds it).
- Give it an **explicit, non-percentage height** (a `%` height collapses to 0).
- The app does client-side routing under `basePath`, so add a **catch-all route**
  in your router for `/{basePath}/*` (e.g. React Router `path="/workflows/*"`).

## `EwfEmbed` — escape hatch / forward-compat

Embed any renderer by name, including ones this package version has no typed
component for yet. It works for whatever the **loaded CDN runtime** supports, so a
renderer newly shipped in the SDK is usable without upgrading this package.

```tsx
import { EwfEmbed } from "@embedworkflow/react";

<EwfEmbed name="reports" data={{ "base-path": "reports" }} onChange={...} />;
// → <div class="EWF__reports" data-base-path="reports">
```

- `name` — renderer class suffix (`"reports"` → `EWF__reports`).
- `data` — keys map to `data-<key>`.

Prefer the named components when they exist; reach for `EwfEmbed` for dynamic
names or renderers the package predates. (The named components are built on top
of `EwfEmbed` via `createEmbed`, also exported if you want a typed façade.)

## License

MIT
