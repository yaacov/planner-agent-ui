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

// Serve configuration for esbuild with watch
async function serve() {
  const context = await esbuild.context({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'build/bundle.js',
    sourcemap: true,
    plugins: [litCssPlugin()],
    loader: {
      '.ts': 'ts',
      '.css': 'css',
      '.png': 'file',
      '.jpg': 'file',
      '.svg': 'file'
    },
    define: { 'process.env.NODE_ENV': '"development"' },
    },
  );

  const server = await context.serve({
    servedir: 'build',
  });

  const { host, port } = server;
  console.log(`Server is running at http://${host}:${port}`);

  // Initial copy of index.html
  copyAndProcessIndexHtml();
}

serve();
