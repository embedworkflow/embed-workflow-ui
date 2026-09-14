import { useRef, type CSSProperties } from "react";
import type { EwfChangeDetail } from "@embedworkflow/embed-core";
import { useEwfMount } from "./useEwfMount";

export interface EwfEmbedProps {
  /** Renderer name (class suffix) — `"reports"` → class `EWF__reports`. */
  name: string;
  /** Data attributes the renderer reads: keys map to `data-<key>`
   *  (e.g. `{ "base-path": "x" }` → `data-base-path="x"`). */
  data?: Record<string, string | undefined>;
  onChange?: (detail: EwfChangeDetail) => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Escape hatch / forward-compat: embed any renderer by name, including ones this
 * package version has no typed component for yet. Works for whatever the LOADED
 * CDN runtime supports — `window.EWF.mount` resolves the renderer at runtime — so
 * a new renderer shipped in the SDK is usable without upgrading this package.
 *
 * Prefer the named components (`EwfApp`, `EwfField`, …) when they exist; reach
 * for this only for dynamic names or renderers the package predates.
 */
export function EwfEmbed({ name, data, onChange, className, style }: EwfEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const deps = data ? Object.values(data) : [];
  useEwfMount(ref, onChange, [name, ...deps]);

  const dataAttrs: Record<string, string | undefined> = {};
  if (data) for (const key of Object.keys(data)) dataAttrs[`data-${key}`] = data[key];

  return (
    <div
      ref={ref}
      className={[`EWF__${name}`, className].filter(Boolean).join(" ")}
      style={style}
      {...dataAttrs}
    />
  );
}
