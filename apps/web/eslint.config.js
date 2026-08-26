import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    name: 'app/vue-conventions',
    rules: {
      // Primitivos shadcn-vue (Button, Card, Input...) e telas de rota (Login, Provas...)
      // seguem o nome de arquivo de uma palavra por convenção do projeto e da própria
      // shadcn-vue; não são componentes de uso genérico fora desse papel.
      'vue/multi-word-component-names': 'off',
      // O prop `class` de repasse de estilo é opcional por design (cn() já trata
      // `undefined`); exigir um valor padrão runtime é redundante com o tipo opcional.
      'vue/require-default-prop': 'off',
    },
  },
  eslintConfigPrettier,
);
