/**
 * Created by zjw on 2016/11/16.
 */
// 导入工具包 require('node_modules里对应模块')
// 基础库，合并，压缩CSS，更改版本名,更改引用路径，清空文件夹,js压缩
var gulp = require('gulp'), concat = require('gulp-concat'), minifycss = require('gulp-minify-css'),
    rev = require('gulp-rev'), revCollector = require('gulp-rev-collector'), clean = require('gulp-clean'),
    uglify = require('gulp-uglify');

// 定义合并,压缩,CSS任务
gulp.task('compressCss', function () {
    gulp.src(['./lib/yt/css/*.css'])//该任务针对的文件
        .pipe(concat('pmp.min.css'))  // 合并后的文件名
        .pipe(minifycss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*' //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/css')) //将会在dist/css下生成 文件夹不存在会自动创建
        .pipe(rev.manifest())        //- 生成一个rev-manifest.json
        .pipe(gulp.dest('dist/rev/css')); //将会在dist/rev下生成
});

//批量替换用
gulp.task('rev', ['compressCss'], function () {
    gulp.src(['./dist/rev/css/rev-manifest.json', './index.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./'));                     //- 替换后的文件输出的目录
});

// 定义合并JS任务
gulp.task('compressJs', function () {
    gulp.src(['./modules/**/*.js']) //多个文件以数组形式传入
        .pipe(concat('pmp.min.js'))  // 合并后的文件名
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js')) //将会在dist/js下生成 文件夹不存在会自动创建
        .pipe(rev.manifest())        //- 生成一个rev-manifest.json
        .pipe(gulp.dest('dist/rev/js')); //将会在dist/rev下生成
});

// 清除任务
gulp.task('clean', function () {
    // src的第二个参数的{read:false}，不读取文件提升效率。
    gulp.src("./dist", {read: false}).pipe(clean());
});

// 定义默认任务
gulp.task('default', ['clean'], function () {
    gulp.start(['compressCss', 'compressJs']);
});