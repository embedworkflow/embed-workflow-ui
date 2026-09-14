import type { CSSProperties } from "react";
import type { EwfChangeDetail } from "@embedworkflow/embed-core";
import { EwfEmbed } from "./EwfEmbed";

type BaseProps = {
  className?: string;
  style?: CSSProperties;
  /** Fires on `ewf:change`. Only emitted by fields; a no-op for other embeds. */
  onChange?: (detail: EwfChangeDetail) => void;
};

/**
 * Builds a typed embed component. `attrs` maps each prop name to the `data-*`
 * attribute (suffix, no `data-` prefix) the corresponding renderer reads.
 *
 * The component itself renders nothing — it maps its typed props to a
 * `{ name, data }` pair and delegates to `<EwfEmbed>`, the single primitive that
 * renders the element and wires the mount lifecycle. So all embeds share one
 * rendering path; these are just typed façades.
 *
 * Mirrors the class → renderer map in the SDK's `index.js`: adding an embeddable
 * is one `createEmbed(...)` call (see `embeds.ts`).
 */
export function createEmbed<K extends string>(
  ewfClass: string,
  attrs: Record<K, string>,
) {
  type Props = Partial<Record<K, string>> & BaseProps;
  const name = ewfClass.replace(/^EWF__/, "");
  const propKeys = Object.keys(attrs) as K[];

  function Embed(props: Props) {
    const data: Record<string, string | undefined> = {};
    for (const k of propKeys) data[attrs[k]] = props[k];
    return (
      <EwfEmbed
        name={name}
        data={data}
        onChange={props.onChange}
        className={props.className}
        style={props.style}
      />
    );
  }
  Embed.displayName = ewfClass;
  return Embed;
}
