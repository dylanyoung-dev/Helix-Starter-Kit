module.exports = function () {
    var config = {
        projectLocations: [
            { 
                Template: "/src/Foundation/Ioc/code/.Helix.Foundation.Ioc.csproj", Destination: "/src/Foundation/Ioc/code/",
                FileName: ".Foundation.Ioc"
            },
            {
                Template: "/src/Foundation/ORM/code/.Helix.Foundation.ORM.csproj",
                Destination: "/src/Foundation/ORM/code/",
                FileName: ".Foundation.ORM"
            },
            {
                Template: "/src/Foundation/Search/code/.Helix.Foundation.Search.csproj",
                Destination: "/src/Foundation/Search/code/",
                FileName: ".Foundation.Search"
            },
            {
                Template: "/src/Foundation/Serialization/code/.Helix.Foundation.Serialization.csproj",
                Destination: "/src/Foundation/Serialization/code/",
                FileName: ".Foundation.Serialization"
            },
            {
                Template: "/src/Project/Common/code/.Helix.Project.Common.csproj",
                Destination: "/src/Project/Common/code/",
                FileName: ".Project.Common"
            }
        ],
        packageLocations: [
            "/src/Foundation/Ioc/code/.package.config",
            "/src/Foundation/ORM/code/.package.config",
            "/src/Foundation/Search/code/.package.config",
            "/src/Foundation/Serialization/code/.package.config",
            "/src/Project/Common/code/.package.config"
        ]
    };

    return config;
};