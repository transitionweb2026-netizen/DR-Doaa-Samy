import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * True only once the component has hydrated on the client. Used to gate
 * portal rendering (modals, drawers) without an SSR/client markup mismatch.
 * Built on useSyncExternalStore rather than a `useEffect(() => setState(true))`
 * so the client-vs-server value swap is handled by React's built-in
 * hydration-safe mechanism instead of a manual post-mount setState.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
