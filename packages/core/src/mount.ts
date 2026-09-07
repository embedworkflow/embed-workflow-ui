import { whenReady } from "./ewf";

/**
 * Mount an EWF element that is already in the DOM with its `EWF__*` class and
 * `data-*` config set. Waits for readiness, then delegates to `window.EWF.mount`.
 *
 * Framework wrappers own listener wiring and lifecycle (they need to cancel if
 * the component unmounts before readiness resolves), so this stays intentionally
 * thin — it does not attach `ewf:change` listeners.
 */
export async function mount(el: HTMLElement): Promise<void> {
  const ewf = await whenReady();
  ewf.mount(el);
}

/**
 * Tear down a previously mounted element. Safe to call even if the runtime
 * never became ready (no-op when `window.EWF.unmount` is absent).
 */
export function unmount(el: HTMLElement): void {
  window.EWF?.unmount?.(el);
}
