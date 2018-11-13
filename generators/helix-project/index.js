'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const projectPrompts = require('../global/prompts/helix.project.prompts.js');
const common = require('../global/common.js');
const presets = common.GetConfig();

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('helix project');
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option set
        var prompts = common.TrimPrompts(projectPrompts, presets.Generators);

        return this.prompt(prompts).then((answers) => {
            this.ModuleName = common.ProcessParameter(answers.ModuleName, presets, "ModuleName");
            this.ModuleNameLower = this.ModuleName.toLowerCase();
            this.SolutionPrefix = common.ProcessParameter(answers.SolutionPrefix, presets, "SolutionPrefix");
        });

    }

    configure() {
        this.projectGuid = guid.v4();

        this.targetPath = path.join('src', 'Project', this.ModuleName);
        
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
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project/', 'Project.' + this.ModuleName + '.Serialization.config')), {
                ModuleName: this.ModuleName
            }
        );
    }

    siteDefinition() {
        this.fs.copyTpl(
            this.templatePath('Project/code/App_Config/Include/Project/.Project.Sample.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project', 'Project.' + this.ModuleName + '.config')), {
                ModuleName: this.ModuleName,
                ModuleNameLower: this.ModuleNameLower
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('Project/code/.Sitecore.Project.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.solutionPrefix + '.Project.' + this.projectName + '.csproj')), {
                projectGuid: `{${this.projectGuid}}`,
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

    solutionAttach() {
        let slnFilePath = common.getSolutionFilePath(this.destinationPath());

        let slnText = this.fs.read(slnFilePath);
        
        slnText = common.ensureSolutionSection(slnText, 'ProjectConfigurationPlatforms', 'postSolution');
        slnText = common.ensureSolutionSection(slnText, 'NestedProjects', 'preSolution');

        let projectFolderGuid = guid.v4();

        let projectDefinition =
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${this.solutionPrefix}.Project.${this.projectName}", "src\\Project\\${this.projectName}\\code\\${this.solutionPrefix}.Project.${this.projectName}.csproj", "{${this.projectGuid}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${this.projectName}", "${this.projectName}", "{${projectFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig = 
            `		{${this.projectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${this.projectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${this.projectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${this.projectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = common.ensureSolutionFolder(slnText, "Project");
        let layerFolderGuid = common.getSolutionFolderGuid(slnText, "Project");

        let projectNesting =
            `		{${this.projectGuid}} = {${projectFolderGuid}}\r\n` +
            `		{${projectFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${projectDefinition}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*\r\n/, `$&${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*\r\n/, `$&${projectNesting}\r\n`);

        this.fs.write(slnFilePath, slnText);
    }
}