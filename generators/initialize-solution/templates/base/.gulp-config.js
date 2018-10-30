module.exports = function () {
    var sitecoreRoot = "<%=sitecoreRoot%>";
    var config = {
        websiteRoot: sitecoreRoot,
        sitecoreLibraries: sitecoreRoot + "\\bin",
        solutionName: "<%=solutionName%>",
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