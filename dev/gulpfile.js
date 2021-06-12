const
  sources_folder = `src`,
  build_folder = `app`;

const path = {
  build: {
    images: `${build_folder}/images/`,
    svg: `${build_folder}/images/svg/`,
    sprites: `${build_folder}/images/sprites/`,
    html: `${build_folder}/`,
    js: `${build_folder}/js/`,
    css: `${build_folder}/css/`,
    fonts: `${build_folder}/fonts/`,
  },
  src: {
    resources: `${sources_folder}/resources/`,
    images: `${sources_folder}/resources/images/`,
    svg: `${sources_folder}/resources/images/svg/`,
    svgMono: `${sources_folder}/resources/images/svg/svg-mono/`,
    svgMulti: `${sources_folder}/resources/images/svg/svg-multi/`,
    html: `${sources_folder}/`,
    js: `${sources_folder}/js/`,
    scss: `${sources_folder}/scss/`,
    fonts: `${sources_folder}/resources/fonts/`,
  },
  watch: {
    html: `${sources_folder}/`,
    css: `${sources_folder}/scss/`,
    js: `${sources_folder}/js/`,
    resources: `${sources_folder}/resources/`,
    images: `${sources_folder}/resources/images/`,
    svg: `${sources_folder}/resources/images/svg/`,
    svgMono: `${sources_folder}/resources/images/svg/svg-mono/`,
    svgMulti: `${sources_folder}/resources/images/svg/svg-multi/`,
    fonts: `${sources_folder}/resources/fonts/`,
  },
  clean: build_folder,
}

const {
  src,
  dest,
  watch,
  series,
  parallel
} = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  terser = require('gulp-terser'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  groupcssmedia = require('gulp-group-css-media-queries'),
  cleancss = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  svgsprite = require('gulp-svg-sprite'),
  htmlmin = require('gulp-htmlmin'),
  babel = require('gulp-babel'),
  gulpif = require('gulp-if'),
  gulpignore = require('gulp-ignore'),
  concat = require('gulp-concat');

let isProd = false;

const html = () => {
  return src(`${path.src.html}*.html`)
    .pipe(fileinclude())
    .pipe(gulpif(isProd, htmlmin({
      collapseWhitespace: true
    })))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

const styles = () => {
  return src(`${path.src.scss}*.scss`)
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
    )
    .pipe(groupcssmedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 5 versions'],
        cascade: false
      })
    )
    .pipe(gulpif(isProd, cleancss()))
    .pipe(gulpif(isProd, concat('style.min.css')))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

const scripts = () => {
  src(`${path.src.js}vendor/**.js`)
    .pipe(gulpif(!isProd, concat('vendor.js')))
    .pipe(gulpif(!isProd, dest(path.build.js)));

  return src(
    [`${path.src.js}vendor/**.js`,
    `${path.src.js}main.js`,
    `${path.src.js}components/**.js`])
    .pipe(babel())
    .pipe(gulpif(!isProd, gulpignore.exclude(`${path.src.js}vendor/**.js`)))
    .pipe(gulpif(isProd, terser()))
    .pipe(gulpif(isProd, concat('main.min.js'), concat('main.js')))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

const resources = () => {
  return src(`${path.src.resources}**/*`,
    {
      ignore: [
        `${path.src.images}**/*`,
        `${path.src.fonts}**/*`
      ]
    })
    .pipe(dest(build_folder))
    .pipe(browsersync.stream());
}

const spriteMono = () => {
  return src(`${path.src.svgMono}/**/*.svg`)
    .pipe(svgsprite({
      mode: {
        symbol: {
          sprite: '../sprite-mono.svg',
        },
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                {
                  removeAttrs: {
                    attrs: ['class', 'data-name', 'fill', 'stroke.*'],
                  },
                },
              ],
            },
          },
        ],
      },
    }))
    .pipe(gulpif(isProd, imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ])))
    .pipe(dest(path.build.sprites))
    .pipe(browsersync.stream());
};

const spriteMulti = () => {
  return src(`${path.src.svgMulti}/**/*.svg`)
    .pipe(svgsprite({
      mode: {
        symbol: {
          sprite: '../sprite-multi.svg',
        },
      },
      shape: {
        transform: [
          {
            svgo: {
              plugins: [
                {
                  removeAttrs: {
                    attrs: ['class', 'data-name'],
                  },
                },
                {
                  removeUselessStrokeAndFill: false,
                },
                {
                  inlineStyles: true,
                },
              ],
            },
          },
        ],
      },
    }))
    .pipe(gulpif(isProd, imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ])))
    .pipe(dest(path.build.sprites))
    .pipe(browsersync.stream());
};

const images = () => {
  return src(`${path.src.images}**/*.{png,jpg,jpeg,ico,webp}`)
    .pipe(gulpif(isProd, imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 })
    ])))
    .pipe(dest(path.build.images))
    .pipe(browsersync.stream());;
};

const svg = () => {
  return src(`${path.src.svg}/**/*.svg`,
    {
      ignore: [
        `${path.src.svgMono}**/*`,
        `${path.src.svgMulti}**/*`
      ]
    })
    .pipe(gulpif(isProd, imagemin([
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ])))
    .pipe(dest(path.build.svg))
    .pipe(browsersync.stream());
};

const fonts = () => {
  return src(`${path.src.fonts}**/*.{woff,woff2}`)
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream());
};

const clean = () => {
  return del(path.clean);
};

const prod = (done) => {
  isProd = true;

  done();
}

const browserSync = () => {
  browsersync.init({
    server: {
      baseDir: `${build_folder}/`
    },
    port: 3000,
  })
};

const watchProject = () => {
  watch(`${path.watch.html}**/*.html`, html);
  watch(`${path.watch.css}**/*.scss`, styles);
  watch(`${path.watch.js}**/*.js`, scripts);
  watch(`${path.watch.images}**/*.{png,jpg,jpeg,ico,webp}`, images);
  watch(`${path.watch.svg}**/*.svg`, { ignore: [`${path.src.svgMono}**/*`, `${path.src.svgMulti}**/*`] }, svg);
  watch(`${path.watch.svgMono}**/*.svg`, spriteMono);
  watch(`${path.watch.svgMulti}**/*.svg`, spriteMulti);
  watch(`${path.watch.fonts}**/*.{woff,woff2}`, fonts);
  watch(`${path.watch.resources}**/*`, { ignore: [`${path.src.images}**/*`, `${path.src.fonts}**/*`] }, resources);
};

exports.default = series(clean, parallel(html, styles, scripts, images, svg, fonts, spriteMono, spriteMulti, resources, browserSync, watchProject));

exports.build = series(clean, prod, html, styles, scripts, images, svg, fonts, spriteMono, spriteMulti, resources);