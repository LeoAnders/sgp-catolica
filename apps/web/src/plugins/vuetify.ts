/**
 * Integracao do Vuetify com os tokens do SGP.
 *
 * Spike da N1: este arquivo apenas traduz `@sgp/design-tokens` para o formato
 * que o Vuetify espera. O pacote de tokens continua sendo a fonte unica de cor,
 * tipografia e raio; nenhum valor visual novo e definido aqui.
 *
 * Os estilos vem do CSS ja compilado (`vuetify/styles`), sem Sass no projeto.
 */
import { createVuetify, type ThemeDefinition } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import 'vuetify/styles';

import { cores, tipografia } from '@sgp/design-tokens';

const temaSgp: ThemeDefinition = {
  dark: false,
  colors: {
    background: cores.fundoAlternativo,
    surface: cores.superficie,
    primary: cores.marca,
    'primary-darken-1': cores.marcaForte,
    secondary: cores.marcaForte,
    error: cores.erro,
    info: cores.informacao,
    success: cores.sucesso,
    warning: cores.alerta,
    'on-background': cores.texto,
    'on-surface': cores.texto,
    'on-primary': cores.textoInvertido,
    'on-secondary': cores.textoInvertido,
    'on-error': cores.textoInvertido,
    'on-info': cores.textoInvertido,
    'on-success': cores.textoInvertido,
    'on-warning': cores.textoInvertido,
    // Superficie invertida para avisos passageiros, derivada dos tokens de texto.
    'superficie-invertida': cores.texto,
    'on-superficie-invertida': cores.textoInvertido,
  },
  variables: {
    // O Vuetify 4 le a pilha tipografica destas duas variaveis; ambas vem dos tokens.
    'font-body': tipografia.familia,
    'font-heading': tipografia.familia,
    // Borda e sombra usam a cor exata do token, sem a opacidade herdada do Material.
    'border-color': cores.borda,
    'border-opacity': 1,
    'shadow-color': cores.texto,
    // Enfase alta reproduz `cores.texto` sem clareamento.
    'high-emphasis-opacity': 1,
    // Enfase media aproxima `cores.textoSecundario`; ver relatorio da spike.
    'medium-emphasis-opacity': 0.72,
  },
};

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'sgp',
    themes: { sgp: temaSgp },
  },
  // Icones por path SVG (@mdi/js), para nao carregar uma fonte inteira de icones.
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    VBtn: { variant: 'flat' },
    // `color` faz o contorno do campo focado usar a cor institucional.
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      color: 'primary',
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      hideDetails: 'auto',
      color: 'primary',
    },
    VChip: { label: true },
    VDialog: { maxWidth: 560 },
  },
});
