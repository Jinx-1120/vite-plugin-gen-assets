# vite-plugin-gen-assets

## Install
```shell
pnpm add vite-plugin-gen-assets -D
```

## Usage
```ts
// vite.config.js / vite.config.ts
import ViteGenAssets from 'vite-plugin-gen-assets';

export default {
  plugins: [
    ViteGenAssets()
  ]
}
```

## Options
```ts
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
```

## Demo
```
./src/assets
├── farm
│   ├── deworming.png
│   ├── harvest.png
├── full-gray@2x.png
├── item_selected.jpeg
├── pet
│   ├── icon-bg.jpg
```
```ts
const Assets = {
  farm: {
    Deworming: 'src/assets/farm/deworming.png',
    Harvest: 'src/assets/farm/harvest.png',
  },
  FullGray2x: 'src/assets/full-gray@2x.png',
  ItemSelected: 'src/assets/item_selected.jpeg',
  pet: {
    IconBg: 'src/assets/pet/icon-bg.jpg',
  },
}
export default Assets;
```