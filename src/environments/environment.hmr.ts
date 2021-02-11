export const environment = {
  production: false,
  hmr: true,
  backend: false,
  apiUrl: window["env"]["apiUrl"] || "default",
  debug: window["env"]["debug"] || false
};
