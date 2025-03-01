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
import fs from "fs-extra";

// `browser-sync` 需要显式创建实例
const browserSync = browserSyncPkg;

// 加载 .env 文件中的变量
dotenv.config();
const env = process.env.NODE_ENV;
const isProd = process.env.IS_PROD === 'true' || false;
const isWriteMaps = process.env.IS_WRITE_MAPS === 'true' || false;
const isWatchScripts = process.env.IS_WATCH_SCRIPTS === 'true' || false;
const isWatchStyles = process.env.IS_WATCH_STYLES === 'true' || false;

console.log(`編譯模式 : ${env} 是否壓縮 : ${isProd}`);

// 初始化 sass 编译器
const sassCompiler = gulpSass(sass);

// 路径配置
const paths = {
  html: {
    src: 'src/**/!(_)*.html',
    dest: 'dist'
  },
  pug: {
    src: 'src/views/**/!(_)*.pug',
    dest: 'dist'
  },
  styles: {
    src: 'src/styles/**/*.{sass,scss}',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/'
  },
  img: {
    src: 'src/img/**/*',
    dest: 'dist/img/'
  }
};

// 编译 Sass 并压缩 CSS
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(sassCompiler().on('error', sassCompiler.logError)) // 使用 sassCompiler
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: ['last 5 version'],
      grid: false,
      remove: false,
    })])) // 使用 autoprefixer 添加前缀
    .pipe(gulpIf(isProd, cleanCSS())) // 压缩 CSS
    .pipe(gulpIf(isWriteMaps, sourcemaps.write('.'))) // 写入 sourcemaps
    .pipe(gulp.dest(paths.styles.dest)) // 输出到目标路径
    .pipe(browserSync.stream()); // 更新浏览器
}

// 合并和压缩 JavaScript
async function scripts() {
  const babel = (await import('gulp-babel')).default;
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat(isProd ? 'jhuangPing.min.js' : 'jhuangPing.js'))
    .pipe(babel({
      presets: ['@babel/preset-env'],
    }))
    .pipe(gulpIf(isProd, uglify()))
    .pipe(gulpIf(isWriteMaps, sourcemaps.write('.')))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// 处理 HTML 的任务
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlExtend({ annotations: false, verbose: false })) // 启用注释和详细日志
    .pipe(gulp.dest(paths.html.dest)) // 输出文件
    .pipe(browserSync.stream());
}

// 编译 Pug
function compilePug() {
  return gulp.src(paths.pug.src) // 获取所有 Pug 文件
    .pipe(pug({
      pretty: true // 如果需要不压缩的 HTML，可以设置为 true
    }))
    .pipe(htmlmin({ // 可选：压缩 HTML 文件
      collapseWhitespace: false,
      removeComments: false
    }))
    .pipe(gulp.dest(paths.pug.dest)) // 输出到目标文件夹
    .pipe(browserSync.stream());    // 实现实时刷新
}

// 搬移圖片
function img(cb) {
  const srcDir = "src/img/";
  const destDir = "dist/img/";

  // **先清空 dist/img/ 內的所有內容**
  fs.emptyDir(destDir, (err) => {
    if (err) {
      console.error("❌ 清空 dist/img/ 失敗:", err);
      return cb(err);
    }

    console.log("🗑️ 已清空 dist/img/ 內的舊圖片");

    // **遞迴搬移 src/img/** 到 dist/img/**
    fs.copy(srcDir, destDir, (err) => {
      if (err) {
        console.error("❌ 搬移圖片失敗:", err);
        return cb(err);
      }
      console.log("✔ 所有圖片已成功搬移");
      browserSync.reload();
      cb();
    });
  });
}

// 监控文件变化并自动刷新
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  if (isWatchStyles) {
    gulp.watch(paths.styles.src, styles);
  }

  if (isWatchScripts) {
    gulp.watch(paths.scripts.src, scripts);
  }

  gulp.watch(paths.img.src, img);

  switch (env) {
    case 'pug':
      gulp.watch(paths.pug.src, compilePug); // 监控 Pug 文件
      break;
    default:
      gulp.watch(paths.html.src, html);
      break;
  }

  gulp.watch('./*.html').on('change', browserSync.reload);
}

// 定义任务
const build = gulp.series(gulp.parallel(styles, scripts));
const watch = gulp.series(build, watchFiles);

// 导出任务
export { html, compilePug, styles, scripts, img, watch, build };
