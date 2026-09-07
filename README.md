# EmbedWorkflow UI

Framework wrappers for embedding [EmbedWorkflow](https://embedworkflow.com) UI
into your own app. The actual components render in the browser via the EWF
runtime loaded from the CDN; these packages are thin adapters that mount that
runtime and bridge its events into each framework's idioms.

> **Status:** `0.x` — the API is stabilizing. Pin your version.

## Packages

| Package | Description |
| --- | --- |
| [`@embedworkflow/embed-core`](packages/core) | Framework-agnostic core — a typed client over `window.EWF` (readiness, mount/unmount, types). |
| [`@embedworkflow/react`](packages/react) | React components (`<EwfField>`). |
| `@embedworkflow/angular` | _(coming next)_ Angular components. |

All wrappers depend on the `embed-core`; none bundle the EWF runtime — it is
loaded at runtime from the CDN.

## How it works

1. Include the EWF loader script and call `EWF.load(publicKey, { jwt })` once
   (sign the JWT server-side). This establishes auth.
2. Drop a component into your form. It renders a host element, waits for the
   runtime to be ready, mounts the field, and reports changes via `onChange`.

```tsx
import { EwfField } from "@embedworkflow/react";

function InvoiceForm() {
  const [channel, setChannel] = useState<string>();
  return (
    <form>
      {/* …your fields… */}
      <EwfField
        workflowKey="onboarding"
        fieldId="slack_channel"
        onChange={(e) => setChannel(String(e.value))}
      />
    </form>
  );
}
```

## Development

```bash
npm install       # installs all workspaces
npm run build     # builds every package
npm test          # runs package tests
```

Releases are managed with [changesets](https://github.com/changesets/changesets):
`npm run changeset` to record a change, `npm run release` to publish.

## License

MIT
