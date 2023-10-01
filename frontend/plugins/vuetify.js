import "vuetify/styles";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: "#16161a",
    surface: "#1e1e24",
    primary: "#7f5af0",
    "primary-darken-1": "#5d3fd2",
    secondary: "#03DAC6",
    "secondary-darken-1": "#018786",
    error: "#D32F2F",
    info: "#1976D2",
    success: "#388E3C",
    warning: "#FBC02D",
  },
};

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "dark",
      themes: {
        myCustomDarkTheme,
      },
    },
  });
  app.vueApp.use(vuetify);
});
