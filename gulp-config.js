module.exports = function () {
    var sitecoreRoot = "c:\inetpub\wwwroot\starterkit.sc";
    var config = {
        websiteRoot: sitecoreRoot,
        sitecoreLibraries: sitecoreRoot + "\\bin",
        solutionName: "Helix",
        licensePath: sitecoreRoot + "\\App_Data\\license.xml",
        runCleanBuilds: false,
        MSBuildToolsVersion: "auto",
        buildConfiguration: "Debug",
        styles: {
            source: [
                `**/code/scss/**/*.{scss, sass, css}`,
                `!**/code/css/**/*.{scss, sass, css}`
            ],
            build: sitecoreRoot + `\\css\\`
        },
        options: {
            sass: {
                outputStyle: 'compressed'
            }
        }
    };
    return config;
};