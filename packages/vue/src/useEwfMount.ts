import { onBeforeUnmount, onMounted, watch, type Ref } from "vue";
import {
  whenReady,
  unmount as ewfUnmount,
  type EwfChangeDetail,
} from "@embedworkflow/embed-core";

/**
 * Mounts the EWF element referenced by `elRef` once the runtime is ready, wires
 * an `ewf:change` listener to `onChange`, and tears everything down on unmount.
 *
 * Pass `watchSource` (a getter over the identifying inputs — workflow/field) to
 * remount when they change; the element's `data-*` are already updated by the
 * time the post-flush watcher runs.
 *
 * Guards the async readiness gap: if the component unmounts before `whenReady`
 * resolves, the pending mount is cancelled so we never mount a detached element.
 */
export function useEwfMount(
  elRef: Ref<HTMLElement | null>,
  onChange?: (detail: EwfChangeDetail) => void,
  watchSource?: () => unknown,
): void {
  let mountedEl: HTMLElement | null = null;
  let listener: ((e: Event) => void) | null = null;
  let cancelled = false;

  const teardown = () => {
    cancelled = true;
    if (mountedEl && listener) {
      mountedEl.removeEventListener("ewf:change", listener);
    }
    if (mountedEl) ewfUnmount(mountedEl);
    mountedEl = null;
    listener = null;
  };

  const setup = () => {
    const node = elRef.value;
    if (!node) return;
    cancelled = false;
    mountedEl = node;
    listener = (e: Event) =>
      onChange?.((e as CustomEvent<EwfChangeDetail>).detail);
    whenReady()
      .then((ewf) => {
        if (cancelled || elRef.value !== node) return;
        node.addEventListener("ewf:change", listener!);
        ewf.mount(node);
      })
      .catch((err) => {
        if (!cancelled) console.error(err);
      });
  };

  onMounted(setup);
  onBeforeUnmount(teardown);

  if (watchSource) {
    watch(
      watchSource,
      () => {
        teardown();
        setup();
      },
      { flush: "post" }, // remount after the new data-* land in the DOM
    );
  }
}
