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
            this.SitecoreVersion = common.ProcessParameter(answers.SitecoreVersion, presets, "SitecoreVersion");
        });

    }

    configure() {
        this.projectGuid = guid.v4();

        this.targetPath = path.join('src', 'Project', this.ModuleName);
        
        this.log('Project Path: ' + this.targetPath);
    }

    runGenerator() {

        this._initializeFolders();
        this._configureUnicorn();
        this._configureSiteDefinition();
        this._configureProject();
        this._configureLayoutDefinition();
        this._configurePackages();
        this._configureAssembly();
        this._configureCodeGeneration();
        this._solutionAttach();
    }

    _initialFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Project'));

        this.fs.copy(
            this.templatePath('templates/**'),
            this.destinationPath(this.targetPath), {
                globOptions: { dot: false }
            }
        );
    }

    _configureUnicorn()
    {
        mkdir.sync(path.join(this.targetPath, 'serialization'));

        this.fs.copyTpl(
            this.templatePath('templates/code/App_Config/Include/Project/.Project.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project/', 'Project.' + this.ModuleName + '.Serialization.config')), {
                ModuleName: this.ModuleName
            }
        );
    }

    _configureSiteDefinition() {
        this.fs.copyTpl(
            this.templatePath('templates/code/App_Config/Include/Project/.Project.Sample.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project', 'Project.' + this.ModuleName + '.config')), {
                ModuleName: this.ModuleName,
                ModuleNameLower: this.ModuleNameLower
            }
        );
    }

    _configureProject() {
        this.fs.copyTpl(
            this.templatePath('templates/code/.Sitecore.Project.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.solutionPrefix + '.Project.' + this.projectName + '.csproj')), {
                ProjectGuid: `{${this.projectGuid}}`,
                ProjectName: this.ProjectName,
                SitecoreVersion: this.SitecoreVersion
            }
        );
    }

    _configureLayoutDefinition() {
        this.fs.copyTpl(
            this.templatePath('Project/code/Views/Layout/.Main.cshtml'),
            this.destinationPath(path.join(this.targetPath, 'code', 'Views', 'Project.' + this.projectName, 'Layout.cshtml'))
        );
    }

    _configurePackages() {
        this.fs.copyTpl(
            this.templatePath('Project/code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                sitecoreVersion: '9.0.180604'
            }
        );
    }

    _configureAssembly() {

        this.fs.copyTpl(
            this.templatePath('Project/code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                projectName: this.projectName,
                solutionPrefix: this.solutionPrefix
            }
        );
    }

    _configureCodeGeneration() {

        this.fs.copyTpl(
            this.templatePath('Project/code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                projectName: this.projectName
            }
        );
    }

    _solutionAttach() {
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