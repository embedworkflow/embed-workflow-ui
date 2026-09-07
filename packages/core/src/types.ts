/**
 * The payload carried by the `ewf:change` DOM event an embedded field
 * dispatches on its host element. `fieldId` echoes the identifier the host
 * embedded with (the `data-field-id`, e.g. `"slack_channel"`), not EWF's
 * internal id. `option` is present only for select-style fields.
 */
export interface EwfChangeDetail {
  fieldId: string;
  value: unknown;
  option?: { value: unknown; label: string };
}

/**
 * The imperative surface EmbedWorkflow exposes on `window.EWF` (defined by the
 * CDN bundle inside `EWF.load()`). This package is a typed client over it — it
 * does not implement it.
 */
export interface EwfGlobal {
  /** Establishes auth context. The host calls this once with its keys/JWT. */
  load: (pkToken: string, options?: Record<string, unknown>) => void;
  /** Mounts the appropriate renderer into an element already carrying an
   *  `EWF__*` class and its `data-*` config. */
  mount: (el: HTMLElement) => void;
  /** Tears down a previously mounted element. */
  unmount: (el: HTMLElement) => void;
  version?: string;
}

declare global {
  interface Window {
    EWF?: Partial<EwfGlobal>;
  }
}
