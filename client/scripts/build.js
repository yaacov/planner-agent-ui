/* eslint-disable no-undef */
import * as esbuild from 'esbuild';
import {
  copyAssets,
  copyAndProcessIndexHtml,
  getBuildConfig,
} from './settings.js';

// Build configuration for esbuild
async function build() {
  try {
    const config = getBuildConfig({ minify: true });
    await esbuild.build(config);

    // Copy static assets and index.html
    copyAndProcessIndexHtml();
    copyAssets();

    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
