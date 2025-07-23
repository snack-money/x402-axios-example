import { defineConfig } from "tsup";
import { cp } from "fs/promises";

export default defineConfig([
  {
    entry: ["src/index.ts"],
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
    onSuccess: async () => {
      try {
        await cp(".env", "dist/.env", { force: true });
        console.log("✅ .env copied to dist/");
      } catch {
        console.warn("⚠️  .env not found.");
      }
    },
  },
]);
