module.exports = {
  config: {
    tailwindjs: "./tailwind.config.js",
  },
  paths: {
    root: "./",
    src: {
      base: "src",
      js: "src/js/**/*.js",
      css: "src/scss/**/*.scss",
      img: "src/images/**/*.+(png|jpg|jpeg|gif|svg)",
      fonts: "*.list",
    },
    dist: {
      base: "dist",
      js: "dist/js",
      css: "dist/css",
      img: "dist/images",
      fonts: "dist/fonts",
    },
  },
};
