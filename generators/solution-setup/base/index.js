'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');

const basePrompts = require('../../global/prompts/solution/base.prompts.js');
const common = require('../../global/common.js');
const presets = common.GetConfig();

let parameters = {};

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        parameters = opts.options;
    }

    init() {
        this.log(chalk.magenta('Running Base Sub-Generator'));
    }

/*     prompting() {

        // Run Generator Specific Prompts (if any)
        return this.prompt(basePrompts).then((answers) => {

            // Define Parameters to Use Throughout File


        });
    } */

    runGenerator() {

        // Run Generator Methods
        this._initialFolders();
        this._solutionSetup();
        this._environmentConfig();
        this._nugetSetup();
        this._projectSetup();
        this._webConfigSetup();
        this._packageSetup();
        this._gulpConfiguration();
        this._publishTargetConfiguration();

    }

    _initialFolders() {
        this.fs.copy(
            this.templatePath('./**'),
            this.destinationPath(), {
                globOption: { dot: false }
            }
        );
    };

    _solutionSetup() {
        this.fs.copyTpl(
            this.templatePath('.HelixStarterKit.sln'),
            this.destinationPath(parameters.SolutionName + ".sln"), {
                Parameters: parameters
            }
        );
    };

    _nugetSetup() {
        this.fs.copyTpl(
            this.templatePath('.Nuget.config'),
            this.destinationPath("Nuget.config"), {
                Parameters: parameters
            }
        );
    }

    _environmentConfig() {
        this.fs.copyTpl(
            this.templatePath('src/Foundation/Serialization/code/App_Config/Include/.Environment.config'),
            this.destinationPath('src/Foundation/Serialization/code/App_Config/Include/Environment.config'),
                { Parameters: parameters }
        );
    }

    _projectSetup() {

        let startPath = this.sourceRoot();
        let destPath = this.destinationPath();
        let paths = [
            { Template: "/src/Foundation/Ioc/code/.Helix.Foundation.Ioc.csproj", Destination: "/src/Foundation/Ioc/code/", FileName: ".Foundation.Ioc" },
            { Template: "/src/Foundation/ORM/code/.Helix.Foundation.ORM.csproj", Destination: "/src/Foundation/ORM/code/", FileName: ".Foundation.ORM" },
            { Template: "/src/Foundation/Serialization/code/.Helix.Foundation.Serialization.csproj", Destination: "/src/Foundation/Serialization/code/", FileName: ".Foundation.Serialization" }
        ];

        paths.forEach(function(path) {
            this.fs.copyTpl(
                startPath + path.Template,
                destPath + path.Destination + parameters.SolutionPrefix + path.FileName + '.csproj', {
                    Parameters: parameters
                }
            );
        }, this);
    };

    _webConfigSetup() {
        let startPath = this.sourceRoot();
        let destPath = this.destinationPath();
        let paths = [
            "\\src\\Foundation\\Ioc\\code\\",
            "\\src\\Foundation\\ORM\\code\\",
            "\\src\\Foundation\\Serialization\\code\\"
        ];

        paths.forEach(function(path) {
            this.fs.copyTpl(
                startPath + path + '.Web.config',
                destPath + path + 'Web.config', {
                    Parameters: parameters
                }
            );
        }, this);
    };

    _packageSetup() {

        let startPath = this.sourceRoot();
        let destPath = this.destinationPath();
        let paths = [
            "\\src\\Foundation\\Ioc\\code\\",
            "\\src\\Foundation\\ORM\\code\\",
            "\\src\\Foundation\\Serialization\\code\\"
        ];

        paths.forEach(function(path) {
            this.fs.copyTpl(
                startPath + path + '.packages.config',
                destPath + path + 'packages.config', {
                    Parameters: parameters
                }
            );
        }, this);
    };

    _gulpConfiguration() {
        this.fs.copyTpl(
            this.templatePath('.gulp-config.js'),
            this.destinationPath('gulp-config.js'), {
                Parameters: parameters
            }
        );
    };

    _publishTargetConfiguration() {

        // Debug Targets
        this.fs.copyTpl(
            this.templatePath('.publishsettingsdebug.targets'),
            this.destinationPath('publishsettingsdebug.targets'), {
                Parameters: parameters
            }
        );

        // Release Targets
        this.fs.copyTpl(
            this.templatePath('.publishsettingsrelease.targets'),
            this.destinationPath('publishsettingsrelease.targets'), {
                Parameters: parameters
            }
        );
    };
}