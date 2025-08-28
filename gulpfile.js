import gulp from "gulp";
import gulpIf from "gulp-if";
import dotenv from "dotenv";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import sourcemaps from "gulp-sourcemaps";
import htmlExtend from "gulp-html-extend";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cleanCSS from "gulp-clean-css";
import sass from "sass";
import pug from "gulp-pug";
import htmlmin from "gulp-htmlmin";
import browserSyncPkg from "browser-sync";
import { spawn } from 'child_process';
import fs from "fs-extra";
import path from "path";

// `browser-sync` 需要顯示創建實例
const browserSync = browserSyncPkg;

// 加載 .env 文件中的變數
dotenv.config();
const env = process.env.NODE_ENV;
const projectNumber = process.env.PROJECT_NUMBER || 'default';
const isProd = process.env.IS_PROD === 'true' || false;
const isWriteMaps = process.env.IS_WRITE_MAPS === 'true' || false;
const isWatchScripts = process.env.IS_WATCH_SCRIPTS === 'true' || false;
const isWatchStyles = process.env.IS_WATCH_STYLES === 'true' || false;

console.log(`編譯模式 : ${env} 是否壓縮 : ${isProd}`);

// 初始化 sass 編譯器
const sassCompiler = gulpSass(sass);

// 路徑配置
const paths = {
  html: {
    src: 'src/**/!(_)*.html',
    dest: 'dist'
  },
  pug: {
    src: `src/project/${projectNumber}/**/!(_)*.pug`,
    dest: `dist/${projectNumber}`
  },
  styles: {
    src: [`src/project/${projectNumber}/styles/**/*.{sass,scss}`, 'submodule/LatticeCSS/**/*.scss'],
    dest: `dist/${projectNumber}/styles/`
  },
  scripts: {
    src: `src/project/${projectNumber}/scripts/**/*.js`,
    dest: `dist/${projectNumber}/scripts/`
  },
  img: {
    src: `src/project/${projectNumber}/img/**/*`,
    dest: `dist/${projectNumber}/img/`
  }
};

// 編譯 Sass 並壓縮 CSS
// 共用 Styles
function commonStyles() {
  return gulp.src('src/styles/**/*.{sass,scss}')
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(sassCompiler({
      outputStyle: isProd ? 'compressed' : 'expanded'
    }).on('error', sassCompiler.logError)) // 使用 sassCompiler
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: ['last 5 version'],
      grid: false,
      remove: false,
    })])) // 使用 autoprefixer 添加前綴
    .pipe(gulpIf(isProd, cleanCSS())) // 壓縮 CSS
    .pipe(gulpIf(isWriteMaps, sourcemaps.write('.'))) // 寫入 sourcemaps
    .pipe(gulp.dest(paths.styles.dest)) // 輸出到目標路徑
    .pipe(browserSync.stream()); // 更新瀏覽器
}

// 專案 Styles
function projectStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(sassCompiler({
      outputStyle: isProd ? 'compressed' : 'expanded'  // ✅ 依照環境調整
    }).on('error', sassCompiler.logError)) // 使用 sassCompiler
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: ['last 5 version'],
      grid: false,
      remove: false,
    })])) // 使用 autoprefixer 添加前綴
    .pipe(gulpIf(isProd, cleanCSS())) // 壓縮 CSS
    .pipe(gulpIf(isWriteMaps, sourcemaps.write('.'))) // 寫入 sourcemaps
    .pipe(gulp.dest(paths.styles.dest)) // 輸出到目標路徑
    .pipe(browserSync.stream()); // 更新瀏覽器
}

// 合並&壓縮 JavaScript
// 共用 JS (plugin + 共用工具)
async function commonScripts() {
  const babel = (await import('gulp-babel')).default;
  return gulp.src([
      'src/scripts/plugin/jquery/jquery-3.4.1.min.js',
      'src/scripts/plugin/swiper/swiper.min.js',
      'src/scripts/plugin/aos/aos.js',
      'src/scripts/plugin/fancybox/jquery.fancybox.min.js',
      'src/scripts/jquery.tool.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat(isProd ? 'common.min.js' : 'common.js'))
    // .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(uglify())
    .pipe(gulpIf(isWriteMaps, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// 專案 JS
async function projectScripts() {
  const babel = (await import('gulp-babel')).default;
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat(isProd ? 'custom.min.js' : 'custom.js'))
    // .pipe(babel({
    //   presets: ['@babel/preset-env'],
    // }))
    .pipe(gulpIf(isProd, uglify()))
    .pipe(gulpIf(isWriteMaps, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// 處理 HTML 任務
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlExtend({ annotations: false, verbose: false })) // 啟用注釋&詳細log
    .pipe(gulp.dest(paths.html.dest)) // 輸出文件
    .pipe(browserSync.stream());
}

// 編譯 Pug
function compilePug() {
  return gulp.src(paths.pug.src) // 護取所有 Pug 文件
    .pipe(pug({
      pretty: true // 如果需要不壓縮的 HTML，可以設置為 true
    }))
    .pipe(htmlmin({ // 可選：壓縮 HTML 文件
      collapseWhitespace: false,
      removeComments: false
    }))
    .pipe(gulp.dest(paths.pug.dest)) // 輸出到目標文件夾
    .pipe(browserSync.stream());    // 實現即時刷新
}

// 搬移圖片
function commonImg(cb) {
  const srcDir = "src/img/";
  const destDir = `dist/${projectNumber}/img/common/`;

  // **先清空 dist/img/ 內的所有內容**
  fs.emptyDir(destDir, (err) => {
    if (err) {
      console.error(`❌ 清空 ${srcDir} 失敗:`, err);
      return cb(err);
    }

    console.log(`🗑️ 已清空 ${destDir}`);

    // **遞迴搬移 src/img/** 到 dist/img/**
    fs.copy(srcDir, destDir, (err) => {
      if (err) {
        console.error("❌ 搬移圖片失敗:", err);
        return cb(err);
      }
      console.log(`✔ 已搬移圖片到 ${destDir}`);
      browserSync.reload();
      cb();
    });
  });
}
function projectImg(cb) {
  const srcDir = `src/project/${projectNumber}/img/`;
  const destDir = `dist/${projectNumber}/img/base/`;

  // **先清空 dist/img/ 內的所有內容**
  fs.emptyDir(destDir, (err) => {
    if (err) {
      console.error(`❌ 清空 ${srcDir} 失敗:`, err);
      return cb(err);
    }

    console.log(`🗑️ 已清空 ${destDir}`);

    // **遞迴搬移 src/img/** 到 dist/img/**
    fs.copy(srcDir, destDir, (err) => {
      if (err) {
        console.error("❌ 搬移圖片失敗:", err);
        return cb(err);
      }
      console.log(`✔ 已搬移圖片到 ${destDir}`);
      browserSync.reload();
      cb();
    });
  });
}

// 啟動 PHP 伺服器
function phpServer(cb = () => { }) {
  const php = spawn('php', ['-S', 'localhost:8000', '-t', 'dist']);

  php.stdout.on('data', (data) => {
    console.log(`PHP: ${data}`);
  });

  php.stderr.on('data', (data) => {
    console.error(`PHP Error: ${data}`);
  });

  process.on('exit', () => {
    php.kill();
  });

  if (typeof cb === 'function') cb();
}

// 監控文件變化並自動刷新
function watchFiles() {
  if (env === 'php') {
    phpServer();

    browserSync.init({
      proxy: 'http://localhost:8000', // 代理 PHP server
      port: 3000,
      open: true,
      notify: false
    });
  } else {
    browserSync.init({
      server: {
        baseDir: `./dist/${projectNumber}`
      }
    });
  }

  if (isWatchStyles) {
    gulp.watch('src/styles/**/*.{sass,scss}', commonStyles);
    gulp.watch(paths.styles.src, projectStyles);
  }

  if (isWatchScripts) {
    gulp.watch('src/scripts/**/*.js', commonScripts);
    gulp.watch(paths.scripts.src, projectScripts);
  }

  gulp.watch('src/img/**/*', commonImg);
  gulp.watch(paths.img.src, projectImg);

  switch (env) {
    case 'pug':
      gulp.watch(paths.pug.src, compilePug); // 監控 Pug 文件
      gulp.watch('./*.html').on('change', browserSync.reload);
      break;
    case 'php':
      gulp.watch('dist/**/*.php').on('change', browserSync.reload);
      break;
    default:
      gulp.watch(paths.html.src, html);
      gulp.watch('./*.html').on('change', browserSync.reload);
      break;
  }
}

// 定義任務
const build = gulp.series(gulp.parallel(
  compilePug,
  commonStyles, projectStyles,
  commonScripts, projectScripts,
  commonImg, projectImg
));
const dev = gulp.series(build, watchFiles);

// 導出任務
export { html, compilePug, commonStyles, projectStyles, commonScripts, projectScripts, commonImg, projectImg, dev, build };
