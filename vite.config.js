import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import cssnano from "cssnano";
import sveltePreprocess from "svelte-preprocess";
import makeAttractionsImporter from "attractions/importer.js";

export default defineConfig(({ mode }) => {
  const plugins = [tailwindcss(), autoprefixer()];

  if (mode == "production") {
    plugins.push(cssnano());
  }

  return {
    base: "./",
    plugins: [
      svelte({
        preprocess: sveltePreprocess({
          scss: {
            importer: makeAttractionsImporter({
              themeFile: resolve("./src/theme.scss")
            })
          }
        })
      })
    ],
    css: {
      postcss: {
        plugins: plugins
      }
    }
  };
});
