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
            this.ModuleName = answers.ModuleName;
            this.SolutionPrefix = answers.SolutionPrefix;
        });

    }

    configure() {
        this.ProjectGuid = guid.v4();

        this.targetPath = path.join('src', 'Feature', this.ModuleName);
        
        this.log('Feature Path: ' + this.targetPath);
    }

    initialFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Feature'));

        this.fs.copy(
            this.templatePath('templates/**'),
            this.destinationPath(this.targetPath), {
                globOptions: { dot: false }
            }
        );
    }

    unicorn()
    {
        mkdir.sync(path.join(this.targetPath, 'serialization'));

        this.fs.copyTpl(
            this.templatePath('templates/code/App_Config/Include/Feature/.Feature.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Feature/', 'Feature.' + this.ModuleName + '.Serialization.config')), {
                ModuleName: this.ModuleName
            }
        );
    }

    project() {
        // TODO: Pass Sitecore Version from presets
        this.fs.copyTpl(
            this.templatePath('templates/code/.Sitecore.Feature.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.SolutionPrefix + '.Feature.' + this.ModuleName + '.csproj')), {
                ProjectGuid: `{${this.ProjectGuid}}`,
                ModuleName: this.ModuleName,
                SitecoreVersion: this.SitecoreVersion
            }
        );
    }

    packages() {
        // TODO: Pass Sitecore Version from presets
        this.fs.copyTpl(
            this.templatePath('templates/code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                SitecoreVersion: this.SitecoreVersion
            }
        );
    }

    assembly() {

        this.fs.copyTpl(
            this.templatePath('templates/code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                ModuleName: this.ModuleName
            }
        );
    }

    codeGeneration() {

        this.fs.copyTpl(
            this.templatePath('templates/code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                ModuleName: this.ModuleName
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