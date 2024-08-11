/* eslint-disable no-undef */
import * as esbuild from 'esbuild';
import {
  copyAssets,
  copyAndProcessIndexHtml,
  getBuildConfig,
} from './settings.js';

/**
 * Serve configuration for esbuild with watch and live reload.
 */
async function serve() {
  // Copy static assets and index.html
  copyAndProcessIndexHtml();
  copyAssets();

  // Define the shorter JavaScript banner for live reload
  const config = getBuildConfig({
    sourcemap: true,
    banner: {
      js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
    },
  });

  const ctx = await esbuild.context(config);

  // Start the server and watch for changes
  const server = await ctx.serve({
    servedir: 'build',
  });

  // Watch *.ts files
  await ctx.watch();
  console.log('watching...');

  const { host, port } = server;
  console.log(`Server is running at http://${host}:${port}`);
}

serve();
