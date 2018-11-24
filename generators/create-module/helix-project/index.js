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
        this.log(chalk.blue('Creating a Project Module...'));
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option set
        let prompts = common.TrimPrompts(projectPrompts, presets.Generators);

        return this.prompt(prompts).then((answers) => {

            // Add to Parameters to Use Throughout File
            parameters.ModuleName = common.ProcessParameter(answers.ModuleName, presets, constants.MODULE_NAME);

            this.ModuleNameLower = parameters.ModuleName.toLowerCase();

        });

    }

    configure() {
        this.ProjectGuid = guid.v4();
        this.targetPath = path.join('src', 'Project', parameters.ModuleName);
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

    _initializeFolders() {
        mkdir.sync(path.join(this.targetPath, 'code/App_Config'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include'));
        mkdir.sync(path.join(this.targetPath, 'code/App_Config/Include/Project'));

        this.fs.copy(
            this.templatePath('./**'),
            this.destinationPath(this.targetPath), {
                globOptions: { dot: false }
            }
        );
    }

    _configureUnicorn()
    {
        mkdir.sync(path.join(this.targetPath, 'serialization'));

        this.fs.copyTpl(
            this.templatePath('./code/App_Config/Include/Project/.Project.Sample.Serialization.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project/', 'Project.' + parameters.ModuleName + '.Serialization.config')), {
                ModuleName: parameters.ModuleName
            }
        );
    }

    _configureSiteDefinition() {
        this.fs.copyTpl(
            this.templatePath('./code/App_Config/Include/Project/.Project.Sample.config'),
            this.destinationPath(path.join(this.targetPath, 'code/App_Config/Include/Project', 'Project.' + parameters.ModuleName + '.config')), {
                ModuleName: parameters.ModuleName,
                ModuleNameLower: this.ModuleNameLower
            }
        );
    }

    _configureProject() {
        this.fs.copyTpl(
            this.templatePath('./code/.Sitecore.Project.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', parameters.SolutionPrefix + '.Project.' + parameters.ModuleName + '.csproj')), {
                ProjectGuid: `{${this.ProjectGuid}}`,
                ModuleName: parameters.ModuleName,
                SitecoreVersion: parameters.SitecoreVersion,
                SolutionPrefix: parameters.SolutionPrefix
            }
        );
    }

    _configureLayoutDefinition() {
        this.fs.copyTpl(
            this.templatePath('./code/Views/Layout/.Main.cshtml'),
            this.destinationPath(path.join(this.targetPath, 'code', 'Views', 'Project.' + parameters.ModuleName, 'Layout.cshtml'))
        );
    }

    _configurePackages() {
        this.fs.copyTpl(
            this.templatePath('./code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                SitecoreVersion: parameters.SitecoreVersion
            }
        );
    }

    _configureAssembly() {

        this.fs.copyTpl(
            this.templatePath('./code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                ModuleName: parameters.ModuleName,
                SolutionPrefix: parameters.SolutionPrefix
            }
        );
    }

    _configureCodeGeneration() {

        this.fs.copyTpl(
            this.templatePath('./code/.CodeGen.config'),
            this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                ModuleName: parameters.ModuleName
            }
        );
    }

    _solutionAttach() {

        common.addProjectToSolution("project", this.destinationPath(), this.ProjectGuid, parameters.SolutionPrefix, parameters.ModuleName);

    }
}