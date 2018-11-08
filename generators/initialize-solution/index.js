'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');
var foreach = require('foreach');

const prompts = require('../global/prompts/solution.prompts.js');
const common = require('../global/common.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('Solution Initialization');
    }

    prompting() {
        return this.prompt(prompts).then((answers) => {
            this.solutionName = answers.solutionName;
            this.version = answers.version;
            this.projectType = answers.type;
            this.solutionPrefix = answers.prefix;
            this.sitecoreRoot = answers.root;
            this.environmentUrl = answers.environmentUrl

            // Store Option
            this.config.set('solutionName', this.solutionName);

            this.config.set('version', this.version);
        });
    }

    initializeBase() {
        this._initialFolders();
        this._solutionSetup();
        this._projectSetup();
        this._packageSetup();
        this._gulpConfiguration();
        this._publishTargetConfiguration();

        if (this.projectType == 'module') {
            this._buildComponent();
        }

        if (this.projectType == 'website') {
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
            { Template: "/src/Foundation/Search/code/.Helix.Foundation.Search.csproj", Destination: "/src/Foundation/Search/code/", FileName: ".Foundation.Search" },
            { Template: "/src/Foundation/Serialization/code/.Helix.Foundation.Serialization.csproj", Destination: "/src/Foundation/Serialization/code/", FileName: ".Foundation.Serialization" },
            { Template: "/src/Project/Common/code/.Helix.Project.Common.csproj", Destination: "/src/Project/Common/code/", FileName: ".Project.Common" }
        ];

        paths.forEach(function(path) {
            this.fs.copyTpl(
                startPath + '/base' + path.Template,
                destPath + path.Destination + this.solutionPrefix + path.FileName + '.csproj', {
                    solutionPrefix: this.solutionPrefix,
                    version: this.version
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
            "\\src\\Foundation\\Search\\code\\",
            "\\src\\Foundation\\Serialization\\code\\",
            "\\src\\Project\\Common\\code\\"
        ];

        paths.forEach(function(path) {
            this.fs.copyTpl(
                startPath + '\\base' + path + '.packages.config',
                destPath + path + 'packages.config', {
                    version: this.version
                }
            );
        }, this);
    };

    _gulpConfiguration() {
        this.fs.copyTpl(
            this.templatePath('base/.gulp-config.js'),
            this.destinationPath('gulp-config.js'), {
                sitecoreRoot: this.sitecoreRoot,
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