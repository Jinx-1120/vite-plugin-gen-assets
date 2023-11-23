import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
interface IOptions {
  /**
   * Resource matching rules
   * default: /\.(png|jpe?g|gif|webp|svg)$/i
   */
  include?: RegExp;
  /**
   * Resource directory
   * default: src/assets
   */
  assetsDir?: string;
  /**
   * Output path
   *default: src/assets/assets.ts
   */
  outputFilePath?: string;
}

const rootDir = process.cwd();

function generateAssetsEnum(options: IOptions) {
  const {
    include = /\.(png|jpe?g|gif|webp|svg)$/i,
    assetsDir = path.resolve(rootDir, 'src/assets'),
    outputFilePath = path.resolve(rootDir, 'src/assets/assets.ts'),
  } = options;

  function toPascalCaseWithoutSpecialChars(str: string) {
    return str
      .replace(/\.[^.]+$/, '')
      .split(/[-_@\s]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  function generateAssetsMap(dir: string, nestedPath: string = '') {
    const files = fs.readdirSync(dir);
    let assets = '';

    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileInfo = fs.statSync(filePath);

      if (fileInfo.isFile() && include.test(file)) {
        const key = toPascalCaseWithoutSpecialChars(file);
        assets += `${key}: new URL('/${path.relative(rootDir, filePath)}', import.meta.url).href,\n`;
      } else if (fileInfo.isDirectory()) {
        assets += `${file}: {\n`;
        assets += generateAssetsMap(filePath, `${nestedPath}${file}.`);
        assets += `},\n`;
      }
    }

    return assets;
  }
  const assets = generateAssetsMap(assetsDir);

  const code = `/* eslint-disable */\n
  const Assets = {
    ${assets}
  };\nexport default Assets;`;

  fs.writeFileSync(outputFilePath, code);
}

export default function ViteGenAssetsPlugin(options: IOptions = {}): Plugin {
  return {
    name: 'vite-generate-assets-plugin',
    buildStart() {
      generateAssetsEnum(options);
    },
  };
}
