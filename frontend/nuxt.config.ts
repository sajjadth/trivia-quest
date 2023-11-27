import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import path from "path";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  nitro: {
    output: {
      publicDir: path.join(__dirname, "dist"),
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
  ],
  app: {
    baseURL: "/trivia-quest/",
    head: {
      link: [{ rel: "icon", href: "/trivia-quest/favicon.ico" }],
      title: "Trivia Quest",
      meta: [
        {
          name: "description",
          content: `Transform your online presence with our expert web development services.
                    From stunning design to seamless functionality,
                    we bring your vision to life. Get a free consultation today!`,
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.APP_API_BASE_URL,
      BACKEND_STATUS_API_URL: process.env.BACKEND_STATUS_API_URL,
    },
  },
  css: ["~/assets/styles/main.sass"],
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "~/assets/styles/_variables.sass" as *\n',
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ["vuetify"],
    },
  },
});
