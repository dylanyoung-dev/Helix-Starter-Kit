'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const featurePrompts = require('../../global/prompts/modules/feature.prompts.js');
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
        this.log(chalk.blue('Create a Feature Module...'));
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option set
        let prompts = common.TrimPrompts(featurePrompts, presets.Generators);

        return this.prompt(prompts).then((answers) => {

            // Add to Parameters to Use Throughout File
            parameters.ModuleName = common.ProcessParameter(answers.ModuleName, presets, constants.MODULE_NAME);

        });

    }

    configure() {
        this.ProjectGuid = guid.v4();
        this.targetPath = path.join('src', 'Feature', parameters.ModuleName);
    }

    initialFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Feature'));

        this.fs.copy(
            this.templatePath('./**'),
            this.destinationPath(this.targetPath), {
                globOptions: { dot: false }
            }
        );
    }

    unicorn()
    {
        mkdir.sync(path.join(this.targetPath, 'serialization'));

        this.fs.copyTpl(
            this.templatePath('./code/App_Config/Include/Feature/.Feature.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Feature/', 'Feature.' + parameters.ModuleName + '.Serialization.config')), {
                ModuleName: parameters.ModuleName
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('./code/.Sitecore.Feature.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', parameters.SolutionPrefix + '.Feature.' + parameters.ModuleName + '.csproj')), {
                ProjectGuid: `{${this.ProjectGuid}}`,
                ModuleName: parameters.ModuleName,
                SitecoreVersion: parameters.SitecoreVersion
            }
        );
    }

    packages() {
        // TODO: Pass Sitecore Version from presets
        this.fs.copyTpl(
            this.templatePath('./code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                SitecoreVersion: parameters.SitecoreVersion
            }
        );
    }

    assembly() {

        this.fs.copyTpl(
            this.templatePath('./code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                ModuleName: parameters.ModuleName
            }
        );
    }

    codeGeneration() {

        this.fs.copyTpl(
            this.templatePath('./code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                ModuleName: parameters.ModuleName
            }
        );

    }

    solutionAttach() {
        let slnFilePath = common.getSolutionFilePath(this.destinationPath());

        let slnText = this.fs.read(slnFilePath);

        // Stop Process if Project Already Exists in the Solution (for any reason)
        if (slnText.indexOf(`${parameters.SolutionPrefix}.Feature.${parameters.ModuleName}.csproj`) > -1) {
            return;
        }
        
        slnText = common.ensureSolutionSection(slnText, 'ProjectConfigurationPlatforms', 'postSolution');
        slnText = common.ensureSolutionSection(slnText, 'NestedProjects', 'preSolution');

        let featureFolderGuid = guid.v4();

        let projectDefinition =
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${parameters.solutionPrefix}.Feature.${parameters.ModuleName}", "src\\Feature\\${parameters.ModuleName}\\code\\${parameters.solutionPrefix}.Feature.${parameters.ModuleName}.csproj", "{${this.ProjectGuid}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${parameters.ModuleName}", "${parameters.ModuleName}", "{${featureFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig = 
            `		{${this.ProjectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = common.ensureSolutionFolder(slnText, "Feature");
        let layerFolderGuid = common.getSolutionFolderGuid(slnText, "Feature");

        let projectNesting =
            `		{${this.ProjectGuid}} = {${featureFolderGuid}}\r\n` +
            `		{${featureFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${projectDefinition}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*\r\n/, `$&${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*\r\n/, `$&${projectNesting}\r\n`);

        this.fs.write(slnFilePath, slnText);
    }
}