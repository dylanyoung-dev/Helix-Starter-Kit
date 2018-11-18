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
        this._projectSetup();
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
                SolutionPrefix: parameters.SolutionPrefix
            }
        );
    };

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
                    SolutionPrefix: parameters.SolutionPrefix,
                    SitecoreVersion: parameters.SitecoreVersion
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
            "\\src\\Foundation\\Serialization\\code\\",
        ];

        paths.forEach(function(path) {
            this.fs.copyTpl(
                startPath + path + '.packages.config',
                destPath + path + 'packages.config', {
                    SitecoreVersion: parameters.SitecoreVersion
                }
            );
        }, this);
    };

    _gulpConfiguration() {
        this.fs.copyTpl(
            this.templatePath('.gulp-config.js'),
            this.destinationPath('gulp-config.js'), {
                EnvironmentRoot: parameters.EnvironmentRoot,
                SolutionName: parameters.SolutionName
            }
        );
    };

    _publishTargetConfiguration() {

        // Debug Targets
        this.fs.copyTpl(
            this.templatePath('.publishsettingsdebug.targets'),
            this.destinationPath('publishsettingsdebug.targets'), {
                EnvironmentUrl: parameters.EnvironmentUrl
            }
        );

        // Release Targets
        this.fs.copyTpl(
            this.templatePath('.publishsettingsrelease.targets'),
            this.destinationPath('publishsettingsrelease.targets'), {
                EnvironmentUrl: parameters.EnvironmentUrl
            }
        );
    };
}