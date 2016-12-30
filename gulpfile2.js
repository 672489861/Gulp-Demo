/**
 * Created by zjw on 2016/11/16.
 */
// ���빤�߰� require('node_modules���Ӧģ��')
// �����⣬�ϲ���ѹ��CSS�����İ汾��,��������·��������ļ���,jsѹ��
var gulp = require('gulp'), concat = require('gulp-concat'), minifycss = require('gulp-minify-css'),
    rev = require('gulp-rev'), revCollector = require('gulp-rev-collector'), clean = require('gulp-clean'),
    uglify = require('gulp-uglify');

// ����ϲ�,ѹ��,CSS����
gulp.task('compressCss', function () {
    gulp.src(['./lib/yt/css/*.css'])//��������Ե��ļ�
        .pipe(concat('pmp.min.css'))  // �ϲ�����ļ���
        .pipe(minifycss({
            advanced: false,//���ͣ�Boolean Ĭ�ϣ�true [�Ƿ����߼��Ż����ϲ�ѡ�����ȣ�]
            compatibility: 'ie7',//����ie7�����¼���д�� ���ͣ�String Ĭ�ϣ�''or'*' [���ü���ģʽ�� 'ie7'��IE7����ģʽ��'ie8'��IE8����ģʽ��'*'��IE9+����ģʽ]
            keepBreaks: true,//���ͣ�Boolean Ĭ�ϣ�false [�Ƿ�������]
            keepSpecialComments: '*' //������������ǰ׺ ������autoprefixer���ɵ������ǰ׺�������������������п��ܽ���ɾ����Ĳ���ǰ׺
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/css')) //������dist/css������ �ļ��в����ڻ��Զ�����
        .pipe(rev.manifest())        //- ����һ��rev-manifest.json
        .pipe(gulp.dest('dist/rev/css')); //������dist/rev������
});

//�����滻��
gulp.task('rev', ['compressCss'], function () {
    gulp.src(['./dist/rev/css/rev-manifest.json', './index.html'])   //- ��ȡ rev-manifest.json �ļ��Լ���Ҫ����css���滻���ļ�
        .pipe(revCollector())                                   //- ִ���ļ���css�����滻
        .pipe(gulp.dest('./'));                     //- �滻����ļ������Ŀ¼
});

// ����ϲ�JS����
gulp.task('compressJs', function () {
    gulp.src(['./modules/**/*.js']) //����ļ���������ʽ����
        .pipe(concat('pmp.min.js'))  // �ϲ�����ļ���
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js')) //������dist/js������ �ļ��в����ڻ��Զ�����
        .pipe(rev.manifest())        //- ����һ��rev-manifest.json
        .pipe(gulp.dest('dist/rev/js')); //������dist/rev������
});

// �������
gulp.task('clean', function () {
    // src�ĵڶ���������{read:false}������ȡ�ļ�����Ч�ʡ�
    gulp.src("./dist", {read: false}).pipe(clean());
});

// ����Ĭ������
gulp.task('default', ['clean'], function () {
    gulp.start(['compressCss', 'compressJs']);
});