// 引入 gulp 和插件
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const dotenv = require('dotenv');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const htmlExtend = require('gulp-html-extend');
const gulpSass = require('gulp-sass');
const postcss = require('gulp-postcss'); // 使用 PostCSS
const autoprefixer = require('autoprefixer'); // 自动添加前缀
const cleanCSS = require('gulp-clean-css');
const sass = require('sass');
const pug = require('gulp-pug');
const htmlmin = require('gulp-htmlmin');

// 加载 .env 文件中的变量
dotenv.config();
const env = process.env.NODE_ENV;
const isProd = process.env.IS_PROD;

console.log(`編譯模式 : ${env} 是否壓縮 : ${isProd}`)

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
    // .pipe(isProd ? cleanCSS() : $.noop()) // 压缩 CSS
    // .pipe(sourcemaps.write('.')) // 写入 sourcemaps
    .pipe(gulp.dest(paths.styles.dest)) // 输出到目标路径
    .pipe(browserSync.stream()); // 更新浏览器
}

// 合并和压缩 JavaScript
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(
      $.babel({
        presets: ['@babel/preset-env'],
      })
    )
    // .pipe(isProd ? uglify() : $.noop())
    // .pipe(sourcemaps.write('.'))
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


// 监控文件变化并自动刷新
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);

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
exports.html = html;
exports.compilePug = compilePug;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
