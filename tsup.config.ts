import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/main.ts"],
    format: ["esm"],
    outDir: "dist/esm",
    clean: true,
    dts: true,
    sourcemap: true,
    splitting: true,
    banner: { js: "#!/usr/bin/env node" },
    minify: false,
    target: "esnext",
    treeshake: true,
    tsconfig: "tsconfig.json",
  },
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    outDir: "dist/cjs",
    clean: false,
    sourcemap: false,
    banner: { js: "#!/usr/bin/env node" },
    splitting: false,
    minify: false,
    target: "esnext",
    treeshake: true,
    tsconfig: "tsconfig.json",
  },
]);
