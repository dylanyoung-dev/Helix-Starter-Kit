module.exports = function () {
    var sitecoreRoot = "C:\\inetpub\\wwwroot\\starterkit.sc";
    var config = {
        websiteRoot: sitecoreRoot + "\\Website",
        sitecoreLibraries: sitecoreRoot + "\\Website\\bin",
        solutionName: "Helix",
        licensePath: sitecoreRoot + "\\Data\\license.xml",
        runCleanBuilds: false,
        MSBuildToolsVersion: "Any",
        buildConfiguration: "Debug",
        styles: {
            source: [
                `**/code/scss/**/*.{scss, sass, css}`,
                `!**/code/css/**/*.{scss, sass, css}`
            ],
            build: sitecoreRoot + `\\Website\\css\\`
        },
        options: {
            sass: {
                outputStyle: 'compressed'
            }
        }
    };
    return config;
};