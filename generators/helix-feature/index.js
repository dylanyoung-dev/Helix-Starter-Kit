'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const prompts = require('../global/prompts/helix.feature.prompts.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('helix feature');
    }

    prompting() {

        return this.prompt(prompts).then((answers) => {
            this.featureName = answers.featureName;
            this.solutionPrefix = answers.solutionPrefix;
            this.log('Feature Name: ' + this.featureName);
        });

    }

    configure() {
        this.projectGuid = '{' + guid.v4() + '}';

        this.targetPath = path.join('src', 'Feature', this.featureName);
        
        this.log('Feature Path: ' + this.targetPath);
    }

    initialFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Feature'));

        this.fs.copy(
            this.templatePath('Feature/**'),
            this.destinationPath(this.targetPath), {
                globOptions: { dot: false }
            }
        );
    }

    unicorn()
    {
        mkdir.sync(path.join(this.targetPath, 'serialization'));

        this.fs.copyTpl(
            this.templatePath('Feature/code/App_Config/Include/Feature/.Feature.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Feature/', 'Feature.' + this.featureName + '.Serialization.config')), {
                featureName: this.featureName
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('Feature/code/.Sitecore.Feature.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.solutionPrefix + '.Feature.' + this.featureName + '.csproj')), {
                projectGuid: this.projectGuid,
                featureName: this.featureName,
                sitecoreVersion: '9.0.180604'
            }
        );
    }

    packages() {
        this.fs.copyTpl(
            this.templatePath('Feature/code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                sitecoreVersion: '9.0.180604'
            }
        );
    }

    assembly() {

        this.fs.copyTpl(
            this.templatePath('Feature/code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                featureName: this.featureName
            }
        );
    }

    codeGeneration() {

        this.fs.copyTpl(
            this.templatePath('Feature/code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config'))
        );

    }

    solutionAttach() {
        
    }
}