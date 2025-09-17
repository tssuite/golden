// @license
// Copyright (c) 2025 tssuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ include: ['src/**/*'] })],

  build: {
    copyPublicDir: false,
    minify: false,
    // sourcemap: 'inline',

    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@tssuite/tssuite',
        '@tssuite/json',
        '@tssuite/hash',
        // Add all peer depencies from package.json here
      ],
      output: {
        globals: {},
      },
    },
  },
});
