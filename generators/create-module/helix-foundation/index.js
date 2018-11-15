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
            this.ModuleName = answers.ModuleName;
            this.SolutionPrefix = answers.SolutionPrefix;
        });

    }

    configure() {
        this.projectGuid = guid.v4();

        this.targetPath = path.join('src', 'Foundation', this.ModuleName);
        
        this.log('Foundation Path: ' + this.targetPath);
    }

    initialFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Foundation'));

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
            this.templatePath('templates/code/App_Config/Include/Foundation/.Foundation.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Feature/', 'Foundation.' + this.ModuleName + '.Serialization.config')), {
                ModuleName: this.ModuleName
            }
        );
    }

    project() {
        // TODO: Update Sitecore Version from Presets
        this.fs.copyTpl(
            this.templatePath('templates/code/.Sitecore.Foundation.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.SolutionPrefix + '.Foundation.' + this.ModuleName + '.csproj')), {
                ProjectGuid: `{${this.ProjectGuid}}`,
                ModuleName: this.ModuleName,
                SitecoreVersion: this.SitecoreVersion
            }
        );
    }

    packages() {
        // TODO: Update Sitecore Version from Presets
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
                ModuleName: this.ModuleName,
                SolutionPrefix: this.SolutionPrefix
            }
        );
    }

    codeGeneration() {

        this.fs.copyTpl(
            this.templatePath('templates/code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')),
            {
                ModuleName: this.ModuleName
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
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${this.SolutionPrefix}.Foundation.${this.ModuleName}", "src\\Foundation\\${this.ModuleName}\\code\\${this.SolutionPrefix}.Foundation.${this.ModuleName}.csproj", "{${this.ProjectGuid}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${this.ModuleName}", "${this.ModuleName}", "{${foundationFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig = 
            `		{${this.ProjectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = common.ensureSolutionFolder(slnText, "Foundation");
        let layerFolderGuid = common.getSolutionFolderGuid(slnText, "Foundation");

        let projectNesting =
            `		{${this.ProjectGuid}} = {${foundationFolderGuid}}\r\n` +
            `		{${foundationFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${projectDefinition}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*\r\n/, `$&${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*\r\n/, `$&${projectNesting}\r\n`);

        this.fs.write(slnFilePath, slnText);
    }
}