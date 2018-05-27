var CleanBuilds = function (location, layer) {

};

var CleanConfigs = function (location, layerName) {

};

var CleanViews = function (location) {

};

var cleanProjectFiles = function (layerName) {

    // Clean dlls for the Layer
    CleanBuilds(config.websiteRoot + '/bin/Helixbase.', layerName);
    return runSequence(
        "__CleanBin",
        "__CleanConfigs",
        "__CleanViews"
        , callback);

    const filesToDelete = [
        + layerName + '.*',
        config.websiteRoot + '/App_Config/Include/' + layerName
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