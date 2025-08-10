### 安裝環境
> gulp-cli: 3.0.0
> gulp: ^5.0.0
> npm : 10.9.2
> pnpm : 10.10.0
> node : v20.19.0

### 執行

請依序執行以下指令來執行 gulp。

```
npm install
gulp dev // 開發
gulp build

// 個別輸出
gulp html
gulp compilePug
gulp styles
gulp scripts
gulp img
```
### .env 設定
```
# 環境變數設定
NODE_ENV=pug // 選擇開發模式 (預設為 html `gulp html`)
IS_PROD=false // 是否進行壓縮處理
IS_WRITE_MAPS=false // 是否生成 sourcemaps
IS_WATCH_SCRIPTS=true // 是否監控 JavaScript 文件的變化
IS_WATCH_STYLES=true // 是否監控 CSS 樣式文件的變化

# Git 設定 // 部署 demo 用
GIT_DEPLOY=https://github.com/<USERNAME>/<REPOSITORY.git> // 設定遠端伺服器倉庫網址
BRANCH=<branch> // 指定分支
```

### 文件結構示例
```
project/
│
├── src/
│   ├── styles/
│   │   ├── main.scss
│   │   └── components/_header.scss
│   ├── scripts/
│   │   ├── plugin/
│   │   ├── main.js
│   │   └── util.js
│   │
│   └── views/
│       ├── component/
│       ├── utils/
│       │   ├── config/
│       │   └── db/
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