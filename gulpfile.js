var gulp = require("gulp");
var path = require("path");
var msbuild = require("gulp-msbuild");
var debug = require("gulp-debug");
var nugetRestore = require("gulp-nuget-restore");
var fs = require("fs");
var gulpUtils = require("gulp-util");
var exec = require("child_process").exec;
var merge = require("merge-stream");
var runSequence = require("run-sequence");

var config = require('./gulp-config.js')();
var utils = require("./tools/scripts/utils.js");
var starter = require("./tools/scripts/starterkit.js");

var $ = require('gulp-load-plugins')({ lazy: true });

var config;
if (fs.existsSync("./gulp-config.user.js")) {
    config = require("./gulp-config.user.js")();
} else {
    config = require("./gulp-config.js")();
}

module.exports.config = config;

starter.header("Helix Starter Kit","A starting point for any Sitecore Helix project","0.0.1");


// Default Task
gulp.task('default', ['__task:publish-projects', '__task:compile-assets'], function () { });

////////////////////////////
//    Machine Setup
////////////////////////////
gulp.task('__task:environment-setup', function (cb) {

});

////////////////////////////
//    Generate Glass (Using Leprechaun)
////////////////////////////
gulp.task('__task:code-generation', function (cb) {
    exec('.\\Tools\\Leprechaun-1.0.0\\Leprechaun.console.exe /c .\\Leprechaun.config', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

///////////////////////////////////////
//    Build the Solution
///////////////////////////////////////
gulp.task("__task:build-solution", function () {
    var targets = ["Build"];

    return gulp.src("./" + config.solutionName + ".sln")
        .pipe(debug({ title: "NuGet restore:" }))
        .pipe(nugetRestore())
        .pipe(debug({ title: "Building solution:" }))
        .pipe(msbuild({
            targets: targets,
            configuration: config.buildConfiguration,
            logCommand: false,
            verbosity: "minimal",
            stdout: true,
            errorOnFail: true,
            maxcpucount: 0,
            toolsVersion: config.MSBuildToolsVersion
        }));
});

///////////////////////////////////////
//    Publish All Projects
///////////////////////////////////////
gulp.task("__task:publish-projects", function (callback) {
    return runSequence(
        "__task:build-solution",
        "publish-foundation",
        "publish-feature",
        "publish-project", callback);
});

///////////////////////////////////////
//     Compile Assets
///////////////////////////////////////
gulp.task('__task:compile-assets', function () {
    return runSequence("__task:compile-styles", callback);
});

gulp.task('__task:compile-styles', function () {

    return gulp
        .src(config.styles.source)
        .pipe($.sass(config.options.sass))
        .pipe($.flatten())
        .pipe(gulp.dest(config.styles.build));

});

gulp.task("publish-foundation", function () {
    return utils.CleanProjectFiles("Foundation"),
    utils.PublishProjects("./src/Foundation");
});

gulp.task("publish-feature", function () {
    return utils.CleanProjectFiles("Feature"),
    utils.PublishProjects("./src/Feature");
});

gulp.task("publish-project", function () {
    return utils.CleanProjectFiles("Project"),
    utils.PublishProjects("./src/Project");
});