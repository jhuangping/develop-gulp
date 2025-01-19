### 安裝環境
> gulp: ^5.0.0
> npm : 10.9.2
> node : v18.17.0

### 執行

請依序執行以下指令來執行 gulp。

```
npm install
gulp watch // 開發
gulp build

// 個別輸出
gulp html
gulp compilePug
gulp styles
gulp scripts
```
### .env 設定
- `NODE_ENV` : 選擇開發模式 (預設為 html `gulp html`)
- `IS_PROD` : 是否壓縮 (暫時關閉需手動設定)


### php 開發
只會用到 `src/styles`  `src/scripts`, `src`裡的其他可以刪

### pug 開發

請刪除
- `src/index.html` `src/include`
- `dist/index.php` `dist/use` `dist/include`

### gulp html 開發

請刪除 
- `views`
- `dist/index.php` `dist/use` `dist/include`

### 文件結構示例
```
project/
│
├── src/
│   ├── styles/
│   │   ├── main.scss
│   │   └── components/_header.scss
│   ├── scripts/
│   │   ├── main.js
│   │   └── util.js
│   │
│   └── views/
│       ├── index.pug
│       └── layout.pug
│ 
├── dist/
│   ├── styles/   (生成的 CSS 文件)
│   ├── scripts/  (生成的 JS 文件)
│
├── gulpfile.js
├── package.json
```