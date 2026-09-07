import { useEffect, useRef, type RefObject } from "react";
import {
  whenReady,
  unmount as ewfUnmount,
  type EwfChangeDetail,
} from "@embedworkflow/embed-core";

/**
 * Mounts the EWF element referenced by `ref` once the runtime is ready, wires
 * an `ewf:change` listener to `onChange`, and tears everything down on cleanup.
 *
 * `deps` are the identifying inputs (workflow/field) — when they change the
 * element remounts (the new `data-*` are already in the DOM by the time this
 * effect re-runs). `onChange` is read through a ref so a changing handler does
 * not trigger a remount.
 *
 * Guards the async readiness gap: if the component unmounts before `whenReady`
 * resolves, the pending mount is cancelled so we never mount into a detached
 * element.
 */
export function useEwfMount(
  ref: RefObject<HTMLElement>,
  onChange?: (detail: EwfChangeDetail) => void,
  deps: unknown[] = [],
): void {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const listener = (e: Event) =>
      onChangeRef.current?.((e as CustomEvent<EwfChangeDetail>).detail);

    whenReady()
      .then((ewf) => {
        if (cancelled || ref.current !== el) return;
        el.addEventListener("ewf:change", listener);
        ewf.mount(el);
      })
      .catch((err) => {
        if (!cancelled) console.error(err);
      });

    return () => {
      cancelled = true;
      el.removeEventListener("ewf:change", listener);
      ewfUnmount(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
