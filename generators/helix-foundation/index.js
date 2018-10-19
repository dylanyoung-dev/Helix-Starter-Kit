'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const prompts = require('../global/prompts/helix.foundation.prompts.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('helix foundation');
    }

    prompting() {

        return this.prompt(prompts).then((answers) => {
            this.foundationName = answers.foundationName;
            this.solutionPrefix = answers.solutionPrefix;
            this.log('Foundation Name: ' + this.foundationName);
        });

    }

    configure() {
        this.projectGuid = '{' + guid.v4() + '}';

        this.targetPath = path.join('src', 'Foundation', this.foundationName);
        
        this.log('Foundation Path: ' + this.targetPath);
    }

    initialFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Foundation'));

        this.fs.copy(
            this.templatePath('Foundation/**'),
            this.destinationPath(this.targetPath), {
                globOptions: { dot: false }
            }
        );
    }

    unicorn()
    {
        mkdir.sync(path.join(this.targetPath, 'serialization'));

        this.fs.copyTpl(
            this.templatePath('Foundation/code/App_Config/Include/Foundation/.Foundation.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Feature/', 'Foundation.' + this.foundationName + '.Serialization.config')), {
                foundationName: this.foundationName
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('Foundation/code/.Sitecore.Foundation.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.solutionPrefix + '.Foundation.' + this.foundationName + '.csproj')), {
                projectGuid: this.projectGuid,
                foundationName: this.foundationName,
                sitecoreVersion: '9.0.180604'
            }
        );
    }

    packages() {
        this.fs.copyTpl(
            this.templatePath('Foundation/code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                sitecoreVersion: '9.0.180604'
            }
        );
    }

    assembly() {

        this.fs.copyTpl(
            this.templatePath('Foundation/code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                foundationName: this.foundationName,
                solutionPrefix: this.solutionPrefix
            }
        );
    }

    codeGeneration() {

        this.fs.copyTpl(
            this.templatePath('Foundation/code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')),
            {
                foundationName: this.foundationName
            }
        );

    }
}