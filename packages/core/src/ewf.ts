import type { EwfGlobal } from "./types";

/**
 * Resolve once `window.EWF.mount` is callable.
 *
 * `mount` is defined by the CDN bundle *inside* `EWF.load()`, so its presence
 * means the SDK script has loaded AND `load()` has run (auth context is set) —
 * a single check covers the whole readiness chain. The loader's queue only
 * buffers early `load()` calls, not `mount`, so callers wait here instead.
 *
 * Polls, and rejects after `timeoutMs` so a missing loader script or a
 * forgotten `EWF.load(...)` fails loudly rather than hanging forever.
 */
export function whenReady(
  { timeoutMs = 10000, intervalMs = 50 }: { timeoutMs?: number; intervalMs?: number } = {},
): Promise<EwfGlobal> {
  const isReady = () => typeof window.EWF?.mount === "function";

  if (isReady()) {
    return Promise.resolve(window.EWF as EwfGlobal);
  }

  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      if (isReady()) {
        clearInterval(timer);
        resolve(window.EWF as EwfGlobal);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(timer);
        reject(
          new Error(
            "[embedworkflow] window.EWF.mount is not available. Ensure the EWF " +
              "loader script is included on the page and EWF.load(publicKey, …) " +
              "has been called before mounting components.",
          ),
        );
      }
    }, intervalMs);
  });
}

/** True if the embed runtime is loaded and ready to mount (synchronous check). */
export function isReady(): boolean {
  return typeof window.EWF?.mount === "function";
}
