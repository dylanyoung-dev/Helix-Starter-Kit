'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');
var foreach = require('foreach');

const prompts = require('../global/prompts/solution.prompts.js');
const common = require('../global/common.js');
const config = require('./config');

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
        var paths = config.projectLocations;

        console.log(paths);

        if (typeof(paths) == "undefined") {

            paths.foreach(function(path) {
                this.fs.copyTpl(
                    this.templatePath(path.Template),
                    this.destinationPath(path.Destination + solutionPrefix + path.FileName + '.csproj'), {
                        solutionPrefix: this.solutionPrefix
                    }
                );
            });

        };
    };

    _packageSetup() {
        let paths = config.packageLocations;

        if (typeof(paths) == "undefined") {

            paths.foreach(function(path) {
                this.fs.copyTpl(
                    this.templatePath(path),
                    this.destinationPath().replace('/.', '/'), {
                        version: this.version
                    }
                );
            });

        };

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

            }
        );

        // Release Targets
        this.fs.copyTpl(
            this.templatePath('base/.publishsettingsrelease.targets'),
            this.destinationPath('publishsettingsrelease.targets'), {

            }
        );
    };
}