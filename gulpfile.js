let project_folder="dist";
let source_folder="src";
let path={
    build:{
        html:project_folder+"/",
        css:project_folder+"/css/",
        js:project_folder+"/js/",
        img:project_folder+"/img/",
    },
    src:{
        html:[source_folder+"/*.html","!"+source_folder+"/_*.html"],
        css:source_folder+"/scss/style.scss",
        js:source_folder+"/js/script.js",
        img:source_folder+"/img/**/*.{jpg,png,ico}",
    },
    watch:{
        html:source_folder+"/**/*.html",
        css:source_folder+"/**/*.scss",
        js:source_folder+"/js/**/*.js",
        img:source_folder+"/img/**/*.{jpg,png,ico}",
    },
    clear:"./"+project_folder+"/"
}
let {src,dest}=require('gulp'),gulp=require('gulp'),browsersync=require("browser-sync").create(),
fileinclude=require("gulp-file-include"),del=require("del"),scss=require("gulp-sass")(require('sass')),
autoprefixer=require("gulp-autoprefixer"),media=require("gulp-group-css-media-queries"),cleancss=require("gulp-clean-css"),cleanjs=require("gulp-uglify-es").default,
rename=require("gulp-rename"),imgmin=require("gulp-imagemin");
function browserSync(params){
    browsersync.init({
        server:{
            baseDir:"./"+project_folder+"/"
        },
        port:3000
    })
}
function html(){
    return src(path.src.html).pipe(fileinclude()).pipe(dest(path.build.html)).pipe(browsersync.stream())
}
function img(){
    return src(path.src.img)
    .pipe(imgmin({
        progressive:true,
        svgoPlugins:[{removeViewBox:false}],
        interlaced:true,
        optimizationLevel:3
    }))
    .pipe(dest(path.build.img)).pipe(browsersync.stream())
}
function js(){
    return src(path.src.js).pipe(fileinclude()).pipe(dest(path.build.js))
    .pipe(rename({extname:".min.js"}))
    .pipe(cleanjs())
    .pipe(dest(path.build.js)).pipe(browsersync.stream())
}
function css(){
    return src(path.src.css)
    .pipe(scss({outputStyle:"expanded"}))
    .pipe(autoprefixer({
        overrideBrowserlist:["last 5 version"],
        cascade:true
    }))
    .pipe(
        dest(path.build.css)
    )
    .pipe(rename({extname:".min.css"}))
    .pipe(
        media()
    )
    .pipe(
        cleancss()
    )
    .pipe(dest(path.build.css)).pipe(browsersync.stream())
}
function watchFiles(){
    gulp.watch([path.watch.html],html);
    gulp.watch([path.watch.css],css);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],img);
}
function clear(){
    return del(path.clear);
}
let build=gulp.series(clear,gulp.parallel(js,html,css,img));
let watch=gulp.parallel(build,watchFiles,browserSync);
exports.img=img;
exports.js=js;
exports.css=css;
exports.watch=html;
exports.default=build;
exports.watch=watch;
exports.default=watch;
