const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const browserify = require("gulp-browserify");
const browserSync = require("browser-sync").create();
const cache = require("gulp-cache");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const googleWebFonts = require("gulp-google-webfonts");
const imagemin = require("gulp-imagemin");
const minify = require("gulp-minify");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");

const options = require("./config.js");

function sync() {
  return browserSync.init({
    proxy: "localhost:8888/cspec",
  });
}

async function css() {
  return gulp
    .src(options.paths.src.css)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer("last 2 version"))
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("maps"))
    .pipe(gulp.dest(options.paths.dist.css))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function gutenbergCSS() {
  return gulp
    .src(options.paths.src.blocks)
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer("last 2 version"))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(options.paths.dist.blocks));
}

function images() {
  return gulp
    .src(options.paths.src.img)
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest(options.paths.dist.img));
}

function js() {
  return gulp
    .src(options.paths.src.js)
    .pipe(browserify())
    .pipe(
      babel({
        presets: [["@babel/preset-env"]],
      })
    )
    .pipe(uglify())
    .pipe(minify({ noSource: true }))
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest(options.paths.dist.js))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function googlefonts() {
  const conf = {
    fontDisplayType: "swap",
  };
  return gulp
    .src(options.paths.src.fonts)
    .pipe(googleWebFonts(conf))
    .pipe(gulp.dest(options.paths.dist.fonts));
}

function watchFiles() {
  gulp.watch(options.paths.src.css, css);
  gulp.watch(options.paths.src.js, js);
  gulp.src("dist/js/main.min.js");
  gulp.src("dist/css/style.min.css");
}

gulp.task("sync", sync);
gulp.task("css", css);
gulp.task("gutenbergCSS", gutenbergCSS);
gulp.task("js", js);
gulp.task("images", images);
gulp.task("googlefonts", googlefonts);

gulp.task("default", gulp.parallel(css, js, images));
gulp.task("watchFiles", gulp.parallel(watchFiles, sync));
