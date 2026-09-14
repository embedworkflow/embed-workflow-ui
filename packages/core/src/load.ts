/**
 * Call `EWF.load(publicKey, options)` reliably.
 *
 * The loader momentarily leaves `window.EWF` undefined while it swaps in the
 * real SDK (it removes the queuing stub before the SDK has finished
 * downloading). A call fired in that window — common when the JWT is signed
 * quickly client-side — hits `window.EWF === undefined` and is silently
 * dropped: no `load()`, so `mount` never appears and components time out.
 *
 * This retries until `window.EWF.load` exists, then calls it once — so callers
 * just invoke `load()` with their auth and the library handles the timing.
 */
export function load(publicKey: string, options?: Record<string, unknown>): void {
  const deadline = Date.now() + 15000;

  const attempt = () => {
    const fn = window.EWF?.load;
    if (typeof fn === "function") {
      fn(publicKey, options);
    } else if (Date.now() < deadline) {
      setTimeout(attempt, 30);
    } else {
      console.error(
        "[embedworkflow] window.EWF.load never became available — is the EWF " +
          "loader script included on the page?",
      );
    }
  };

  attempt();
}
