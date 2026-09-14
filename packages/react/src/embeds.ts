import { createEmbed } from "./createEmbed";

/**
 * One component per client-facing renderer in the SDK's `index.js` RENDERERS
 * map. Keep this list in sync with that map — one line per embeddable. Attr
 * values are the `data-*` suffix (e.g. "base-path" → `data-base-path`).
 */

/** The full workflow builder / app. Give it an explicit non-% height. */
export const EwfApp = createEmbed("EWF__app", {
  basePath: "base-path",
});

/** A workflow's client settings form. */
export const EwfSettingsForm = createEmbed("EWF__settings-form", {
  workflowId: "workflow-id",
  workflowKey: "workflow-key",
});

/** The managed connections UI. */
export const EwfConnections = createEmbed("EWF__connections", {});

/**
 * A single field from a workflow's form. Emits `change` (EwfChangeDetail).
 * Address it directly (`fieldId`), or connection-scoped for a connection's
 * fields (`connection` + `field`, e.g. the Slack channel picker).
 */
export const EwfField = createEmbed("EWF__field", {
  workflowId: "workflow-id",
  workflowKey: "workflow-key",
  fieldId: "field-id",
  connection: "connection",
  field: "field",
  connectionId: "connection-id",
  defaultValue: "value",
});
