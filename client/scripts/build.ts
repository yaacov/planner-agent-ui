import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { litCssPlugin } from 'esbuild-plugin-lit-css';

// Function to copy and process index.html
function copyAndProcessIndexHtml() {
  const srcFile = path.resolve(__dirname, '../src/index.html');
  const destFile = path.resolve(__dirname, '../build/index.html');
  const html = fs.readFileSync(srcFile, 'utf-8');

  fs.writeFileSync(destFile, html);
}

// Build configuration for esbuild
async function build() {
  try {
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      outfile: 'build/bundle.js',
      minify: true,
      sourcemap: true,
      plugins: [litCssPlugin()],
      loader: {
        '.ts': 'ts',
        '.css': 'css',
        '.png': 'file',
        '.jpg': 'file',
        '.svg': 'file'
      },
      define: { 'process.env.NODE_ENV': '"production"' },
    });

    // Copy index.html
    copyAndProcessIndexHtml();

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
