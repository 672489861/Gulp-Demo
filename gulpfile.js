/**
 * Created by zjw on 2016/11/16.
 */
// ���빤�߰� require('node_modules���Ӧģ��')
// �����⣬�ϲ���ѹ��CSS������ļ���,jsѹ��
var gulp = require('gulp'), concat = require('gulp-concat'), minifycss = require('gulp-minify-css'),
    clean = require('gulp-clean'), uglify = require('gulp-uglify');

// ����ϲ�,ѹ��,CSS����
gulp.task('compressCss', function () {
    gulp.src(['./lib/yt/css/ytui.min.css', './lib/yt/css/common.css'])//��������Ե��ļ�
        .pipe(concat('pmp.min.css'))  // �ϲ�����ļ���
        .pipe(minifycss({
            advanced: false,//���ͣ�Boolean Ĭ�ϣ�true [�Ƿ����߼��Ż����ϲ�ѡ�����ȣ�]
            compatibility: 'ie7',//����ie7�����¼���д�� ���ͣ�String Ĭ�ϣ�''or'*' [���ü���ģʽ�� 'ie7'��IE7����ģʽ��'ie8'��IE8����ģʽ��'*'��IE9+����ģʽ]
            keepBreaks: true,//���ͣ�Boolean Ĭ�ϣ�false [�Ƿ�������]
            keepSpecialComments: '*' //������������ǰ׺ ������autoprefixer���ɵ������ǰ׺�������������������п��ܽ���ɾ����Ĳ���ǰ׺
        }))
        .pipe(gulp.dest('dist/css')); //������dist/css������ �ļ��в����ڻ��Զ�����
});

// �ƶ������img�ļ���
gulp.task('move', function () {
    gulp.src(['./lib/yt/fonts/*.*'])
        .pipe(gulp.dest('dist/fonts'));
    gulp.src(['./lib/yt/img/*.*'])
        .pipe(gulp.dest('dist/img'));
});


// ����ϲ�JS����
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

// �������
gulp.task('clean', function () {
    // src�ĵڶ���������{read:false}������ȡ�ļ�����Ч�ʡ�
    gulp.src("./dist", {read: false}).pipe(clean());
});

// ����Ĭ������
gulp.task('default', ['clean'], function () {
    gulp.start(['move', 'compressCss', 'compressJs']);
});