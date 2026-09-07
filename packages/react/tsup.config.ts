import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  // Keep React and the core out of the bundle — they're peer/runtime deps.
  external: ["react", "react-dom", "@embedworkflow/embed-core"],
});
