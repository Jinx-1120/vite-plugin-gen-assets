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

  function generateAssetsMap(dir: string, nestedPath: string[] = []) {
    const files = fs.readdirSync(dir);
    const assets: Record<string, any> = {};

    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileInfo = fs.statSync(filePath);

      if (fileInfo.isFile() && include.test(file)) {
        const key = toPascalCaseWithoutSpecialChars(file);
        const targetObject = nestedPath.reduce((obj, key) => {
          return obj[key] || (obj[key] = {});
        }, assets);
        targetObject[key] = `/${path.relative(rootDir, filePath)}`;
      } else if (fileInfo.isDirectory()) {
        Object.assign(assets, generateAssetsMap(filePath, [...nestedPath, file]));
      }
    }

    return assets;
  }
  const assets = generateAssetsMap(assetsDir);

  const code = `const Assets = ${JSON.stringify(assets, null, 2)};\nexport default Assets;`;

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
