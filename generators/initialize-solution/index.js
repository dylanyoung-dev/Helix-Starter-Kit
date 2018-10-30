'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const prompts = require('../global/prompts/solution.prompts.js');
const common = require('../global/common.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('Solution Initialization');

        this._initializeBase;
    }

    _initializeBase() {
        this.prompt(prompts).then((answers) => {
            this.solutionName = answers.solutionName;
            this.version = answers.version;
            this.projectType = answers.projectType;
            this.solutionPrefix = answers.prefix;
            this.sitecoreRoot = answers.root;
        });

        _initialFolders();
        _solutionSetup();
        _gulpConfiguration();
        _publishTargetConfiguration();

        if (projectType == 'component') {
            this._buildComponent();
        }

        if (projectType == 'website') {
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
        mkdir.sync(path.join(this.targetPath, 'src/Feature'));
        mkdir.sync(path.join(this.targetPath, 'src/Foundation'));
        mkdir.sync(path.join(this.targetPath, 'src/Project'));

        this.fs.copy(
            this.templatePath('base/**'),
            this.destinationPath(this.targetPath), {
                globOption: { dot: false }
            }
        );
    };

    _solutionSetup() {
        this.fs.copyTpl(
            this.templatePath('base/.HelixStarterKit.sln'),
            this.destinationPath(path.join(this.targetPath,this.solutionName, ".sln")), {
                solutionPrefix: this.solutionPrefix
            }
        );
    };

    _gulpConfiguration() {
    
    }

    _publishTargetConfiguration() {
        
    }
}