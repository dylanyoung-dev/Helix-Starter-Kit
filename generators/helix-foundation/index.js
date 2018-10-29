'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const prompts = require('../global/prompts/helix.foundation.prompts.js');
const common = require('../global/common.js');

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
        this.projectGuid = guid.v4();

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
                projectGuid: `{${this.projectGuid}}`,
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

    solutionAttach() {
        let slnFilePath = common.getSolutionFilePath(this.destinationPath());

        let slnText = this.fs.read(slnFilePath);
        
        slnText = common.ensureSolutionSection(slnText, 'ProjectConfigurationPlatforms', 'postSolution');
        slnText = common.ensureSolutionSection(slnText, 'NestedProjects', 'preSolution');

        let foundationFolderGuid = guid.v4();

        let projectDefinition =
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${this.solutionPrefix}.Foundation.${this.foundationName}", "src\\Foundation\\${this.foundationName}\\code\\${this.solutionPrefix}.Foundation.${this.foundationName}.csproj", "{${this.projectGuid}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${this.foundationName}", "${this.foundationName}", "{${foundationFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig = 
            `		{${this.projectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${this.projectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${this.projectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${this.projectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = common.ensureSolutionFolder(slnText, "Foundation");
        let layerFolderGuid = common.getSolutionFolderGuid(slnText, "Foundation");

        let projectNesting =
            `		{${this.projectGuid}} = {${foundationFolderGuid}}\r\n` +
            `		{${foundationFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${projectDefinition}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*\r\n/, `$&${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*\r\n/, `$&${projectNesting}\r\n`);

        this.fs.write(slnFilePath, slnText);
    }
}