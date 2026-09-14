import { defineComponent, h } from "vue";
import { EwfEmbed } from "./EwfEmbed";

/**
 * Builds an embed component. `attrs` maps each prop name to the `data-*`
 * attribute (suffix, no `data-` prefix) the corresponding renderer reads.
 *
 * The component maps its props to a `{ name, data }` pair and delegates to
 * `<EwfEmbed>`, the single primitive that renders the element and wires the
 * mount lifecycle — so all embeds share one rendering path.
 *
 * Mirrors the class → renderer map in the SDK's `index.js`. Note: props are
 * declared at runtime, so editor template type-checking won't infer specific
 * prop names (they still bind correctly at runtime).
 */
export function createEmbed(ewfClass: string, attrs: Record<string, string>) {
  const name = ewfClass.replace(/^EWF__/, "");
  const propKeys = Object.keys(attrs);

  return defineComponent({
    name: ewfClass,
    props: Object.fromEntries(
      propKeys.map((k) => [k, { type: String, default: undefined }]),
    ),
    emits: ["change"],
    setup(props: Record<string, string | undefined>, { emit }) {
      return () =>
        h(
          EwfEmbed,
          {
            name,
            data: Object.fromEntries(propKeys.map((k) => [attrs[k], props[k]])),
            onChange: (detail) => emit("change", detail),
          },
        );
    },
  });
}
