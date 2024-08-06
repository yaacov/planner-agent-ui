import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { litCssPlugin } from 'esbuild-plugin-lit-css';

// Function to copy a directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to copy and process index.html
function copyAndProcessIndexHtml() {
  const srcFile = path.resolve(__dirname, '../src/index.html');
  const destFile = path.resolve(__dirname, '../build/index.html');
  const html = fs.readFileSync(srcFile, 'utf-8');

  fs.writeFileSync(destFile, html);
}

// Call the copyDir function on the assets directory
function copyAssets() {
  const srcDir = path.resolve(__dirname, '../src/assets');
  const destDir = path.resolve(__dirname, '../build/assets');

  copyDir(srcDir, destDir);
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

    // Copy static assets and index.html
    copyAndProcessIndexHtml();
    copyAssets()

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
