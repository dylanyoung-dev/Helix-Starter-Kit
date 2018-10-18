var gulp = require("gulp");
var msbuild = require("gulp-msbuild");
var debug = require("gulp-debug");
var path = require("path");
var nugetRestore = require("gulp-nuget-restore");
var fs = require("fs");
var util = require("gulp-util");
var exec = require("child_process").exec;
var merge = require("merge-stream");
var runSequence = require("run-sequence");

var $ = require('gulp-load-plugins')({ lazy: true });

var config = require('./gulp-config.js')();

module.exports.config = config;

// Default Task
gulp.task('default', ['_CopySitecoreDlls', '_PrepYeomanGenerator', '_PublishProjects', '_CompileAssets'], function () { });

////////////////////////////
//    Generate Glass (Using Leprechaun)
////////////////////////////
gulp.task('CodeGeneration', function (cb) {
    exec('.\\Tools\\Leprechaun-1.0.0\\Leprechaun.console.exe /c .\\src\\Leprechaun.config', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

////////////////////////////
//    Move Sitecore Dlls
////////////////////////////
gulp.task('_CopySitecoreDlls', function () {

    fs.statSync(config.sitecoreLibraries);

    var files = config.sitecoreLibraries + "/**/*";

    var libs = gulp.src(files).pipe(gulp.dest("./Libraries"));

    return merge(libs);

});

gulp.task('_PrepYeomanGenerator', function(done) {
    spawn('npm', ['link'], { cwd: 'generators', stdio: 'inherit', shell: true })
        .on('close', done);
});

////////////////////////////
//    Publish All Projects
////////////////////////////
gulp.task("_PublishProjects", function (callback) {
    return runSequence(
        "__BuildSolution",
        "__PublishFoundation",
        "__PublishFeature",
        "__PublishProject", callback);
});

////////////////////////////
//     Compile Assets
////////////////////////////
gulp.task('_CompileAssets', function () {
    return runSequence("task:compile-styles", callback);
});

gulp.task('task:compile-styles', function () {

    return gulp
        .src(config.styles.source)
        .pipe($.sass(config.options.sass))
        .pipe($.flatten())
        .pipe(gulp.dest(config.styles.build));

});

var cleanProjectFiles = function (layerName) {
    const filesToDelete = [
        gulpConfig.webRoot + '/bin/Helixbase.' + layerName + '.*',
        gulpConfig.webRoot + '/App_Config/Include/' + layerName
    ];
    console.log("Removing " + layerName + " configs/binaries");
    return gulp.src(filesToDelete, { read: false })
        .pipe(clean({ force: true }));
};

var publishProjects = function (location, dest) {
    dest = dest || config.websiteRoot;
    var targets = ["Build"];

    console.log("publish to " + dest + " folder");
    return gulp.src([location + "/**/code/*.csproj"])
        .pipe(foreach(function (stream, file) {
            return stream
                .pipe(debug({ title: "Building project:" }))
                .pipe(msbuild({
                    targets: targets,
                    configuration: config.buildConfiguration,
                    logCommand: false,
                    verbosity: "minimal",
                    stdout: true,
                    errorOnFail: true,
                    maxcpucount: 0,
                    toolsVersion: config.MSBuildToolsVersion,
                    properties: {
                        DeployOnBuild: "true",
                        DeployDefaultTarget: "WebPublish",
                        WebPublishMethod: "FileSystem",
                        DeleteExistingFiles: "false",
                        publishUrl: dest,
                        _FindDependencies: "false"
                    }
                }));
        }));
};

gulp.task("__BuildSolution", function () {
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

gulp.task("__PublishFoundation", function () {
    //cleanProjectFiles("Foundation"),
    publishProjects("./src/Foundation");
});

gulp.task("__PublishFeature", function () {
    //cleanProjectFiles("Feature"),
    publishProjects("./src/Feature");
});

gulp.task("__PublishProject", function () {
    //cleanProjectFiles("Project"),
    publishProjects("./src/Project");
});