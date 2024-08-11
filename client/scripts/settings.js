import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Determine the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Copies a directory recursively from src to dest.
 * @param {string} src - Source directory path.
 * @param {string} dest - Destination directory path.
 */
export function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copies and processes the index.html file.
 */
export function copyAndProcessIndexHtml() {
  const srcFile = path.resolve(__dirname, '../src/index.html');
  const destFile = path.resolve(__dirname, '../build/index.html');

  // Change index.js to bundle.js
  const htmlContent = fs.readFileSync(srcFile, 'utf-8');
  const updatedHtml = htmlContent.replace('index.js', 'bundle.js');

  fs.writeFileSync(destFile, updatedHtml);
}

/**
 * Copies PatternFly assets and the src/assets directory to the build directory.
 */
export function copyAssets() {
  const srcDir = path.resolve(__dirname, '../node_modules/@patternfly');
  const destDir = path.resolve(__dirname, '../build/node_modules/@patternfly');

  const directoriesToCopy = [
    { src: 'icons', dest: 'icons' },
    { src: 'patternfly/assets', dest: 'patternfly/assets' },
  ];

  directoriesToCopy.forEach(({ src, dest }) =>
    copyDirectory(path.join(srcDir, src), path.join(destDir, dest))
  );

  const stylesSrc = path.join(srcDir, 'patternfly/patternfly.css');
  const stylesDest = path.join(destDir, 'patternfly/patternfly.css');
  fs.copyFileSync(stylesSrc, stylesDest);

  // Copy the src/assets directory to build/assets
  const srcAssetsDir = path.resolve(__dirname, '../src/assets');
  const destAssetsDir = path.resolve(__dirname, '../build/assets');
  copyDirectory(srcAssetsDir, destAssetsDir);
}

/**
 * Returns the default esbuild configuration, merged with any extra configuration provided.
 * @param {Object} extraConfig - Additional configuration options to override the defaults.
 * @returns {Object} - The merged configuration object.
 */
export function getBuildConfig(extraConfig = {}) {
  const defaultConfig = {
    entryPoints: ['src/index.ts'],
    outfile: 'build/bundle.js',
    bundle: true,
    loader: {
      '.ts': 'ts',
      '.css': 'text',
      '.svg': 'text',
    },
  };

  return {
    ...defaultConfig,
    ...extraConfig,
  };
}
