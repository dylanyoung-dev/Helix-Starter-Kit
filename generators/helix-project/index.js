'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const prompts = require('../global/prompts/helix.project.prompts.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('helix project');
    }

    prompting() {

        return this.prompt(prompts).then((answers) => {
            this.projectName = answers.projectName;
            this.projectNameLower = this.projectName.toLowerCase();
            this.solutionPrefix = answers.solutionPrefix;
            this.log('Project Name: ' + this.projectName);
        });

    }

    configure() {
        this.projectGuid = '{' + guid.v4() + '}';

        this.targetPath = path.join('src', 'Project', this.projectName);
        
        this.log('Project Path: ' + this.targetPath);

    }

    initialFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Project'));

        this.fs.copy(
            this.templatePath('Project/**'),
            this.destinationPath(this.targetPath), {
                globOptions: { dot: false }
            }
        );
    }

    unicorn()
    {
        mkdir.sync(path.join(this.targetPath, 'serialization'));

        this.fs.copyTpl(
            this.templatePath('Project/code/App_Config/Include/Project/.Project.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project/', 'Project.' + this.projectName + '.Serialization.config')), {
                projectName: this.projectName
            }
        );
    }

    siteDefinition() {
        this.fs.copyTpl(
            this.templatePath('Project/code/App_Config/Include/Project/.Project.Sample.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project', 'Project.' + this.projectName + '.config')), {
                projectName: this.projectName,
                projectNameLower: this.projectNameLower
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('Project/code/.Sitecore.Project.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.solutionPrefix + '.Project.' + this.projectName + '.csproj')), {
                projectGuid: this.projectGuid,
                projectName: this.projectName,
                sitecoreVersion: '9.0.180604'
            }
        );
    }

    layoutDefinition() {
        this.fs.copyTpl(
            this.templatePath('Project/code/Views/Layout/.Main.cshtml'),
            this.destinationPath(path.join(this.targetPath, 'code', 'Views', 'Project.' + this.projectName, 'Layout.cshtml'))
        );
    }

    packages() {
        this.fs.copyTpl(
            this.templatePath('Project/code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                sitecoreVersion: '9.0.180604'
            }
        );
    }

    assembly() {

        this.fs.copyTpl(
            this.templatePath('Project/code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                projectName: this.projectName,
                solutionPrefix: this.solutionPrefix
            }
        );
    }

    codeGeneration() {

        this.fs.copyTpl(
            this.templatePath('Project/code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                projectName: this.projectName
            }
        );

    }
}