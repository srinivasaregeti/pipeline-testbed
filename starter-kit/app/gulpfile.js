// USWDS SASS GULPFILE

const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const gulp = require("gulp");
const pkg = require("./node_modules/uswds/package.json");
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uswds = require("./node_modules/uswds-gulp/config/uswds");

sass.compiler = require("sass");

// Project Sass source directory
const PROJECT_SASS_SRC = "./src/uswds_assets/sass";

// Images destination
const IMG_DEST = "./src/uswds_assets/img";

// Fonts destination
const FONTS_DEST = "./src/uswds_assets/fonts";

// Javascript destination
const JS_DEST = "./src/uswds_assets/js";

// Compiled CSS destination
const CSS_DEST = "./src/uswds_assets/css";

// TASKS

gulp.task("copy-uswds-setup", () => {
  return gulp
    .src(`${uswds}/scss/theme/**/**`)
    .pipe(gulp.dest(`${PROJECT_SASS_SRC}`));
});

gulp.task("copy-uswds-fonts", () => {
  return gulp.src(`${uswds}/fonts/**/**`).pipe(gulp.dest(`${FONTS_DEST}`));
});

gulp.task("copy-uswds-images", () => {
  return gulp.src(`${uswds}/img/**/**`).pipe(gulp.dest(`${IMG_DEST}`));
});

gulp.task("copy-uswds-js", () => {
  return gulp.src(`${uswds}/js/**/**`).pipe(gulp.dest(`${JS_DEST}`));
});

gulp.task("build-sass", function (done) {
  var plugins = [
    // Autoprefix
    autoprefixer({
      cascade: false,
      grid: true,
    }),
    // Minify
    csso({ forceMediaMerge: false }),
  ];
  return (
    gulp
      .src([`${PROJECT_SASS_SRC}/*.scss`])
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        sass.sync({
          includePaths: [
            `${PROJECT_SASS_SRC}`,
            `${uswds}/scss`,
            `${uswds}/scss/packages`,
          ],
        })
      )
      .pipe(replace(/\buswds @version\b/g, "based on uswds v" + pkg.version))
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write("."))
      // uncomment the next line if necessary for Jekyll to build properly
      //.pipe(gulp.dest(`${SITE_CSS_DEST}`))
      .pipe(gulp.dest(`${CSS_DEST}`))
  );
});

// use init to initally copy all assets and build sass. This is done only once.
gulp.task(
  "init",
  gulp.series(
    "copy-uswds-setup",
    "copy-uswds-fonts",
    "copy-uswds-images",
    "copy-uswds-js",
    "build-sass"
  )
);

gulp.task("watch-sass", function () {
  gulp.watch(
    `${PROJECT_SASS_SRC}/**/*.scss`,
    { events: "all" },
    gulp.series("build-sass")
  );
});

gulp.task("watch", gulp.series("build-sass", "watch-sass"));

gulp.task("default", gulp.series("watch"));
