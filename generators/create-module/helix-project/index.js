'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const projectPrompts = require('../../global/prompts/modules/project.prompts.js');
const common = require('../../global/common.js');
const constants = require('../../global/constants.js');
const presets = common.GetConfig();

let parameters = {};

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        parameters = opts.options;
    }

    init() {
        this.log(chalk.green('Creating a Project Module'));
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option set
        var prompts = common.TrimPrompts(projectPrompts, presets.Generators);

        return this.prompt(prompts).then((answers) => {

            // Add to Parameters to Use Throughout File
            parameters.ModuleName = common.ProcessParameter(answers.ModuleName, presets, constants.MODULE_NAME);

            this.ModuleNameLower = parameters.ModuleName.toLowerCase();

            parameters.SolutionPrefix = common.ProcessParameter(answers.SolutionPrefix, presets, constants.SOLUTION_PREFIX);

            parameters.SitecoreVersion = common.ProcessParameter(answers.SitecoreVersion, presets, constants.SITECORE_VERSION);

        });

    }

    configure() {
        this.ProjectGuid = guid.v4();
        this.targetPath = path.join('src', 'Project', this.ModuleName);
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
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project/', 'Project.' + parameters.ModuleName + '.Serialization.config')), {
                ModuleName: parameters.ModuleName
            }
        );
    }

    _configureSiteDefinition() {
        this.fs.copyTpl(
            this.templatePath('templates/code/App_Config/Include/Project/.Project.Sample.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project', 'Project.' + parameters.ModuleName + '.config')), {
                ModuleName: parameters.ModuleName,
                ModuleNameLower: this.ModuleNameLower
            }
        );
    }

    _configureProject() {
        // TODO: Update Sitecore Version from Presets
        this.fs.copyTpl(
            this.templatePath('templates/code/.Sitecore.Project.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', this.SolutionPrefix + '.Project.' + parameters.ModuleName + '.csproj')), {
                ProjectGuid: `{${this.ProjectGuid}}`,
                ModuleName: parameters.ModuleName,
                SitecoreVersion: parameters.SitecoreVersion,
                SolutionPrefix: parameters.SolutionPrefix
            }
        );
    }

    _configureLayoutDefinition() {
        this.fs.copyTpl(
            this.templatePath('templates/code/Views/Layout/.Main.cshtml'),
            this.destinationPath(path.join(this.targetPath, 'code', 'Views', 'Project.' + parameters.ModuleName, 'Layout.cshtml'))
        );
    }

    _configurePackages() {
        // TODO: Update Sitecore Version from Presets
        this.fs.copyTpl(
            this.templatePath('templates/code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                SitecoreVersion: parameters.SitecoreVersion
            }
        );
    }

    _configureAssembly() {

        this.fs.copyTpl(
            this.templatePath('templates/code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                ModuleName: parameters.ModuleName,
                SolutionPrefix: parameters.SolutionPrefix
            }
        );
    }

    _configureCodeGeneration() {

        this.fs.copyTpl(
            this.templatePath('templates/code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                ModuleName: parameters.ModuleName
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
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${parameters.SolutionPrefix}.Project.${parameters.ModuleName}", "src\\Project\\${parameters.ModuleName}\\code\\${parameters.SolutionPrefix}.Project.${parameters.ModuleName}.csproj", "{${this.ProjectGuid}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${parameters.ModuleName}", "${parameters.ModuleName}", "{${projectFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig = 
            `		{${this.ProjectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = common.ensureSolutionFolder(slnText, "Project");
        let layerFolderGuid = common.getSolutionFolderGuid(slnText, "Project");

        let projectNesting =
            `		{${this.ProjectGuid}} = {${projectFolderGuid}}\r\n` +
            `		{${projectFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${projectDefinition}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*\r\n/, `$&${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*\r\n/, `$&${projectNesting}\r\n`);

        this.fs.write(slnFilePath, slnText);
    }
}