'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');
var foreach = require('foreach');

const solutionPrompts = require('../global/prompts/solution.prompts.js');
const common = require('../global/common.js');
const presets = common.GetConfig();

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('Solution Initialization');
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option
        var prompts = common.TrimPrompts(solutionPrompts, presets.Generators);

        return this.prompt(prompts).then((answers) => {

            // Define Parameters to Use Throughout File
            this.solutionName = ProcessParameter(answers.SolutionName, presets, "SolutionName");
            this.sitecoreVersion = ProcessParameter(answers.SitecoreVersion, presets, "SitecoreVersion");
            this.solutionType = ProcessParameter(answers.SolutionType, presets, "SolutionType");
            this.solutionPrefix = ProcessParameter(answers.SolutionPrefix, "SolutionPrefix");
            this.environmentRoot = ProcessParameter(answers.EnvironmentRoot, "EnvironmentRoot");
            this.environmentUrl = ProcessParameter(answers.EnvironmentUrl, "EnvironmentUrl");

        });
    }

    initializeBase() {
        this._initialFolders();
        this._solutionSetup();
        this._projectSetup();
        this._packageSetup();
        this._gulpConfiguration();
        this._publishTargetConfiguration();

        if (this.solutionType == 'module') {
            this._buildComponent();
        }

        if (this.solutionType == 'website') {
            this._buildWebsite();
        }
    }

    _buildComponent() {
        console.log("Building a Component Setup");
    }

    _buildWebsite() {
        console.log("Building a Website Setup");
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
            this.destinationPath(this.solutionName + ".sln"), {
                solutionPrefix: this.solutionPrefix
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
                destPath + path.Destination + this.solutionPrefix + path.FileName + '.csproj', {
                    solutionPrefix: this.solutionPrefix,
                    version: this.sitecoreVersion
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
                    version: this.sitecoreVersion
                }
            );
        }, this);
    };

    _gulpConfiguration() {
        this.fs.copyTpl(
            this.templatePath('base/.gulp-config.js'),
            this.destinationPath('gulp-config.js'), {
                sitecoreRoot: this.environmentRoot,
                solutionName: this.solutionName
            }
        );
    };

    _publishTargetConfiguration() {

        // Debug Targets
        this.fs.copyTpl(
            this.templatePath('base/.publishsettingsdebug.targets'),
            this.destinationPath('publishsettingsdebug.targets'), {
                environmentUrl: this.environmentUrl
            }
        );

        // Release Targets
        this.fs.copyTpl(
            this.templatePath('base/.publishsettingsrelease.targets'),
            this.destinationPath('publishsettingsrelease.targets'), {
                environmentUrl: this.environmentUrl
            }
        );
    };
}

module.exports = generators.Base({
    end: function () {
        var done = this.async();

        console.log('Just Testing');
        //this.spawnCommand('createdb.cmd').on('close', done);
    }
});