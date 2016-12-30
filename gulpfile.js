/**
 * Created by zjw on 2016/11/16.
 */
// 导入工具包 require('node_modules里对应模块')
// 基础库，合并，压缩CSS，清空文件夹,js压缩
var gulp = require('gulp'), concat = require('gulp-concat'), minifycss = require('gulp-minify-css'),
    clean = require('gulp-clean'), uglify = require('gulp-uglify');

// 定义合并,压缩,CSS任务
gulp.task('compressCss', function () {
    gulp.src(['./lib/yt/css/ytui.min.css', './lib/yt/css/common.css'])//该任务针对的文件
        .pipe(concat('pmp.min.css'))  // 合并后的文件名
        .pipe(minifycss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*' //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('dist/css')); //将会在dist/css下生成 文件夹不存在会自动创建
});

// 移动字体和img文件夹
gulp.task('move', function () {
    gulp.src(['./lib/yt/fonts/*.*'])
        .pipe(gulp.dest('dist/fonts'));
    gulp.src(['./lib/yt/img/*.*'])
        .pipe(gulp.dest('dist/img'));
});


// 定义合并JS任务
gulp.task('compressJs', function () {
    gulp.src(['./modules/frame/office/js/controller/officeController.js',
        './modules/frame/tabs/js/tabs.js', './modules/frame/**/router.js',
        './modules/frame/login/js/controller/loginController.js'])
        .pipe(concat('pmp.frame.module.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/js'));
    gulp.src(['./modules/frame/dashboard/js/controller/*.js', './modules/frame/dashboard/js/service/*.js',
        './modules/frame/login/js/service/loginService.js', './modules/frame/office/js/controller/menuController.js',
        './modules/frame/office/js/service/*.js', './modules/frame/setting/js/controller/*.js',
        './modules/frame/setting/js/service/*.js'])
        .pipe(concat('pmp.frame.data.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/js'));
    gulp.src(['./modules/**/*.js', '!./modules/frame/**/*.js'])
        .pipe(concat('pmp.service.module.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('dist/js'));
});

// 清除任务
gulp.task('clean', function () {
    // src的第二个参数的{read:false}，不读取文件提升效率。
    gulp.src("./dist", {read: false}).pipe(clean());
});

// 定义默认任务
gulp.task('default', ['clean'], function () {
    gulp.start(['move', 'compressCss', 'compressJs']);
});