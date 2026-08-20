import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineConfig({
  // `autoImport` deixa no bundle apenas os componentes usados nas telas.
  plugins: [vue({ template: { transformAssetUrls } }), vuetify({ autoImport: true })],
  server: { port: 5173 },
});
