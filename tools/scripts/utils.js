"use strict";
var gulp = require("gulp");
var clean = require('gulp-clean');
var foreach = require("gulp-foreach");
var msbuild = require("gulp-msbuild");
var debug = require("gulp-debug");
var config = require('../../gulp-config.js')();
var Utils = {};

Utils.CleanDlls = function (location, layerName) {
    // Update to include any custom dlls
    const filesToDelete = [
        location.concat(layerName) + "*"
    ];

    console.log("Removing " + filesToDelete + " Dlls");

    return gulp.src(filesToDelete, { read: false })
        .pipe(clean({ force: true }));
};

Utils.CleanConfigs = function (location, layerName) {
    // Update to include any custom configs
    var filesToDelete = [
        location.concat('/', layerName, '/') + "*"
    ];

    console.log("Removing " + filesToDelete + " Dlls");

    return gulp.src(filesToDelete, { read: false })
        .pipe(clean({ force: true }));
};

Utils.CleanProjectFiles = function (layerName) {

    // Clean dlls for the Layer
    this.CleanDlls(config.websiteRoot + '/bin/Helix.', layerName);
    this.CleanConfigs(config.websiteRoot + '/App_Config/Include/', layerName);

    const filesToDelete = [
        + layerName + '.*',
        config.websiteRoot + '/App_Config/Include/' + layerName
    ];

    console.log("Removing " + layerName + " configs/binaries");

    return gulp.src(filesToDelete, { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
};

Utils.PublishProjects = function (location, dest) {
    dest = dest || config.websiteRoot;
    var targets = ["Build"];

    console.log("publish to " + dest + " folder");
    console.log("files: " + location + "/**/code/*.csproj")
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

module.exports = Utils;