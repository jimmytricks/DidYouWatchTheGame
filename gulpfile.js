var gulp = require("gulp"); // Gulp itself
var browserSync = require("browser-sync").create(); // Browser sync server
var sass = require("gulp-sass"); // SASS pre-processing
var prefix = require("gulp-autoprefixer"); // CSS autoprefixing
var rename = require('gulp-rename'); // Rename files

/* JS import and minification for "js" task below (currently unused) */
// var uglify = require("gulp-uglify"); // JS Minify
// var gulpImports = require("gulp-imports"); // In-File Importing (Used for JS Concat)
// var plumber = require("gulp-plumber"); // Error Handling


/**
 * Launch BrowserSync server
 */
gulp.task("serve", ["sass"], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false // Automatic Browser Launch
    });
});


/**
 * Reload BrowserSync
 */
gulp.task("browserSync-reload", function () {
    browserSync.reload();
});


/**
 * Compile stylesheet from Main Sass file and output to CSS folder
 */
gulp.task("sass", function () {
    return gulp
        .src("Sass/Main.scss") // Input
        .pipe(
            sass({
                // SASS processing
                includePaths: ["scss"],
                onError: browserSync.notify
            })
        )
        .pipe(rename('style.css'))
        .pipe(prefix(["last 15 versions", "> 1%"], { cascade: true })) // Autoprefixer
        .pipe(gulp.dest("CSS")) // Output
        .pipe(browserSync.reload({ stream: true })); // Reload server
});


/**
 * Compile files from JS into minified subfolder (not currently used)
 */
// gulp.task("js", function() {
//     gulp
//         src("JS/*.js") // Input
//         .pipe(plumber()) // Error Handling
//         .pipe(gulpImports()) // Import JS includes
//         .pipe(uglify()) // Minify JS
//         .pipe(gulp.dest("JS/min/")) // Output
//         .pipe(browserSync.reload({ stream: true })); // Reload server
// });


/**
 * Watch scss files for changes & recompile
 * Watch js files for changes & recompile
 * Watch html reload BrowserSync
 */
gulp.task("watch", function () {
    gulp.watch("Sass/**/*.scss", ["sass"]);
    // gulp.watch("JS/*.js", ["js"]); // concat and minify currently unused
    gulp.watch("JS/*.js", ["browserSync-reload"]);
    gulp.watch("index.html", ["browserSync-reload"]);
});



/**
 * Default task, running just `gulp` will compile the sass,
 * launch BrowserSync & watch files for changes.
 */
gulp.task("default", ["serve", "watch"]);
