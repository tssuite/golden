import esbuild from 'esbuild';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { copyFile } from 'fs/promises';

// .............................................................................
const build = async () => {
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      bundle: true, // Bundle everything into one file
      platform: 'node', // Target Node.js
      target: 'node22', // Set a modern Node.js version
      format: 'cjs', // Output CommonJS (CJS)
      outfile: 'dist/golden.cjs',
      external: [], // Keep dependencies external if needed
      minify: true,
      sourcemap: false,
    })
    .catch(() => process.exit(1));
};

const cleanDist = () => {
  if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
  }
  mkdirSync('dist');
};

const copyREADME = async () => {
  await copyFile('README.public.md', 'dist/README.md');
};

// .............................................................................
cleanDist();
await build();
await copyREADME();
