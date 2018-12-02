var gulp = require('gulp'),
    babel = require("gulp-babel"), // es6转es5/
    del = require('del'), // 删除文件
    uglify = require('gulp-uglify'), // 压缩js
    rev = require('gulp-rev'), // 添加时间戳
    gutil = require('gulp-util'),
    htmlmin = require('gulp-htmlmin'), // 压缩html
    revCollector = require('gulp-rev-collector')
    minifycss = require('gulp-minify-css'); // 压缩css


// 文件路径
var paths = {
    html: {
        src: 'homepage/*.html',
        dest: 'build/homepage/'
    },
    css: {
        src: 'homepage/css/*.css',
        dest: 'build/homepage/css/'
    },
    js: {
        src: ['homepage/js/*.js', '!homepage/js/jquery.min.js'],
        dest: 'build/homepage/js/'
    },
    img: {
        src: 'homepage/img/*',
        dest: 'build/homepage/img/'
    }
};



gulp.task('mincss', function () {
    gulp.src(paths.css.src)
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest(paths.css.dest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/homepage/rev/css/'))
});

// 编译JS文件
gulp.task('js', function () {
    return gulp.src(paths.js.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify({
            mangle: true,
            compress: true
        }
        ))
        .pipe(rev())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest(paths.js.dest))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/homepage/rev/js/'))
});

gulp.task('copy', function () {
    return gulp.src('homepage/js/jquery.min.js')
        .pipe(gulp.dest(paths.js.dest))
});

gulp.task('html', function () {
    var options = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src(paths.html.src)
        .pipe(htmlmin(options))
        .pipe(gulp.dest(paths.html.dest));
});

// 替换加了MD5时间戳的文件
gulp.task('revmd5', ['js', 'mincss'], function () {
    return gulp.src(['build/homepage/rev/**/*.json', 'build/homepage/*.html'])
        .pipe(
            revCollector(
                {
                    replaceReved   : true,
                    dirReplacements: {}
                }
            )
        )
        .pipe(gulp.dest(paths.html.dest));
});

gulp.task('clean', function () {
    return del('build')
});

gulp.task('default', ['clean'], function () {
    return gulp.start('clean', 'copy', 'js', 'mincss', 'html', 'revmd5');
})
