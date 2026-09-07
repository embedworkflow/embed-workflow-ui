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

The EWF loader script must be on the page, and `EWF.load(publicKey, { jwt })`
called once (sign the JWT **server-side**). See the
[embedding guide](https://embedworkflow.com/docs).

## `<EwfField>`

Render a single field from a workflow's form inside your own form — e.g. a
Slack-channel picker bound to your managed connection. Uncontrolled: it reports
changes via `onChange`; your app owns submission.

```tsx
import { EwfField } from "@embedworkflow/react";

<EwfField
  workflowId="wf_123"        // or workflowKey="onboarding"
  fieldId="slack"            // field name or id in the workflow's form
  onChange={(e) => console.log(e.value, e.option)}
/>;
```

| Prop | Type | Notes |
| --- | --- | --- |
| `workflowId` / `workflowKey` | `string?` | Identify the workflow (one or the other). |
| `fieldId` | `string` | Field name or id. Required. |
| `defaultValue` | `string?` | Seed value (uncontrolled). |
| `onChange` | `(detail: EwfChangeDetail) => void` | Fires on every change. |
| `className` / `style` | — | Applied to the host element. |

`EwfChangeDetail` is `{ fieldId, value, option? }` — see the embedding guide.

Also exported: `useEwfMount` (the hook behind `<EwfField>`), and `whenReady` /
`isReady` (re-exported from `@embedworkflow/embed-core`).

## License

MIT
