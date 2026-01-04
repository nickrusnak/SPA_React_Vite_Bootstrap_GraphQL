/**
 * ESLint Konfiguration für die React SPA
 * 
 * Verwendet das moderne Flat-Config-Format von ESLint 9.
 * Integriert TypeScript, React Hooks und Prettier.
 */
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Ordner die ignoriert werden sollen
  globalIgnores(['dist', 'node_modules']),
  
  // Konfiguration für TypeScript und React Dateien
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Empfohlene JavaScript-Regeln
      js.configs.recommended,
      // TypeScript-spezifische Regeln
      tseslint.configs.recommended,
      // React Hooks Regeln (exhaustive-deps, etc.)
      reactHooks.configs.flat.recommended,
      // React Refresh für Hot Module Replacement
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // Keine unused vars (außer wenn mit _ prefixed)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // React Refresh - nur Komponenten exportieren
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]);
