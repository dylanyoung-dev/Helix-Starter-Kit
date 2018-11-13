'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');

const basePrompts = require('../global/prompts/solution/base.prompts.js');
const common = require('../global/common.js');
const presets = common.GetConfig();

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log(chalk.blue('Running Base Sub-Generator'));
    }

    prompting() {

        // Run Generator Specific Prompts (if any)

    }

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
            this.templatePath('base/**'),
            this.destinationPath(), {
                globOption: { dot: false }
            }
        );
    };

    _solutionSetup() {
        this.fs.copyTpl(
            this.templatePath('base/.HelixStarterKit.sln'),
            this.destinationPath(this.SolutionName + ".sln"), {
                SolutionPrefix: this.SolutionPrefix
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
                startPath + '/base' + path.Template,
                destPath + path.Destination + this.SolutionPrefix + path.FileName + '.csproj', {
                    SolutionPrefix: this.SolutionPrefix,
                    SitecoreVersion: this.SitecoreVersion
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
                startPath + '\\base' + path + '.packages.config',
                destPath + path + 'packages.config', {
                    SitecoreVersion: this.SitecoreVersion
                }
            );
        }, this);
    };

    _gulpConfiguration() {
        this.fs.copyTpl(
            this.templatePath('base/.gulp-config.js'),
            this.destinationPath('gulp-config.js'), {
                SitecoreRoot: this.EnvironmentRoot,
                SolutionName: this.SolutionName
            }
        );
    };

    _publishTargetConfiguration() {

        // Debug Targets
        this.fs.copyTpl(
            this.templatePath('base/.publishsettingsdebug.targets'),
            this.destinationPath('publishsettingsdebug.targets'), {
                EnvironmentUrl: this.EnvironmentUrl
            }
        );

        // Release Targets
        this.fs.copyTpl(
            this.templatePath('base/.publishsettingsrelease.targets'),
            this.destinationPath('publishsettingsrelease.targets'), {
                EnvironmentUrl: this.EnvironmentUrl
            }
        );
    };
}