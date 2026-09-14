import { defineComponent, h, ref, type PropType } from "vue";
import type { EwfChangeDetail } from "@embedworkflow/embed-core";
import { useEwfMount } from "./useEwfMount";

/**
 * Escape hatch / forward-compat + the primitive every named component delegates
 * to. Embed any renderer by name — including ones this package version has no
 * typed component for yet. Works for whatever the LOADED CDN runtime supports
 * (`window.EWF.mount` resolves the renderer at runtime), so a renderer newly
 * shipped in the SDK is usable without upgrading this package.
 *
 * ```vue
 * <EwfEmbed name="reports" :data="{ 'base-path': 'reports' }" @change="..." />
 * ```
 */
export const EwfEmbed = defineComponent({
  name: "EwfEmbed",
  props: {
    /** Renderer name (class suffix) — `"reports"` → class `EWF__reports`. */
    name: { type: String, required: true },
    /** Data attributes: keys map to `data-<key>` (e.g. `{ 'base-path': 'x' }`). */
    data: {
      type: Object as PropType<Record<string, string | undefined>>,
      default: () => ({}),
    },
  },
  emits: {
    change: (_detail: EwfChangeDetail) => true,
  },
  setup(props, { emit }) {
    const elRef = ref<HTMLElement | null>(null);

    useEwfMount(
      elRef,
      (detail) => emit("change", detail),
      () => [props.name, ...Object.values(props.data)],
    );

    return () =>
      h("div", {
        ref: elRef,
        class: `EWF__${props.name}`,
        ...Object.fromEntries(
          Object.entries(props.data).map(([k, v]) => [`data-${k}`, v]),
        ),
      });
  },
});
