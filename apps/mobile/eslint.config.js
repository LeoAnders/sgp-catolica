const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([expoConfig, eslintConfigPrettier, { ignores: ['dist/**'] }]);
