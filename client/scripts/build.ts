import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { litCssPlugin } from 'esbuild-plugin-lit-css';
import { fileURLToPath } from 'url';

// Current direcotry
const __filename = url.fileURLToPath(new URL(import.meta.url));
const __dirname = path.dirname(__filename);

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
  // Define source and destination file paths
  const srcFile = path.resolve(__dirname, '../src/index.html');
  const destFile = path.resolve(__dirname, '../build/index.html');
  
  const html = fs.readFileSync(srcFile, 'utf-8');
  const processedHtml = html.replace('index.ts', 'bundle.js');
  
  // Write the processed HTML to the destination file
  fs.writeFileSync(destFile, processedHtml);
}

/**
 * Copies PatternFly assets from the source directory to the destination directory.
 */
function copyAssets() {
  // Define the source and destination directories for PatternFly icons
  const srcDir = fileURLToPath(new URL('../node_modules/@patternfly', import.meta.url));
  const destDir = path.join(__dirname, '../build/node_modules'); // Replace 'path_to_destination' with the actual destination path
  
  // Create the destination directory, including any necessary parent directories
  fs.mkdirSync(path.join(destDir, '@patternfly', 'icons'), { recursive: true });

  // Copy the contents of the source directory to the destination directory
  copyDir(path.join(srcDir, 'icons'), path.join(destDir, '@patternfly', 'icons'));

  // Create the destination directory, including any necessary parent directories
  fs.mkdirSync(path.join(destDir, '@patternfly', 'patternfly', 'assets'), { recursive: true });

  // Copy the contents of the source directory to the destination directory
  copyDir(path.join(srcDir, 'patternfly', 'assets'), path.join(destDir, '@patternfly', 'patternfly', 'assets'));

  // Copy style files
  const styles = fs.readFileSync(path.join(srcDir, 'patternfly', 'patternfly-base.css'), 'utf-8');
  
  // Write the processed HTML to the destination file
  fs.writeFileSync(path.join(destDir, '@patternfly', 'patternfly', 'patternfly-base.css'), styles);
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
