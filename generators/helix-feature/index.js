'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const prompts = require('../global/prompts/helix.feature.prompts.js');
const common = require('../global/common.js');

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
        this.projectGuid = guid.v4();

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
                projectGuid: `{${this.projectGuid}}`,
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
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                featureName: this.featureName
            }
        );

    }

    solutionAttach() {
        let slnFilePath = common.getSolutionFilePath(this.destinationPath());

        let slnText = this.fs.read(slnFilePath);
        
        slnText = common.ensureSolutionSection(slnText, 'ProjectConfigurationPlatforms', 'postSolution');
        slnText = common.ensureSolutionSection(slnText, 'NestedProjects', 'preSolution');

        let featureFolderGuid = guid.v4();

        let projectDefinition =
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${this.solutionPrefix}.Feature.${this.featureName}", "src\\Feature\\${this.featureName}\\code\\${this.solutionPrefix}.Feature.${this.featureName}.csproj", "{${this.projectGuid}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${this.featureName}", "${this.featureName}", "{${featureFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig = 
            `		{${this.projectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${this.projectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${this.projectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${this.projectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = common.ensureSolutionFolder(slnText, "Feature");
        let layerFolderGuid = common.getSolutionFolderGuid(slnText, "Feature");

        let projectNesting =
            `		{${this.projectGuid}} = {${featureFolderGuid}}\r\n` +
            `		{${featureFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${projectDefinition}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*\r\n/, `$&${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*\r\n/, `$&${projectNesting}\r\n`);

        this.fs.write(slnFilePath, slnText);
    }
}