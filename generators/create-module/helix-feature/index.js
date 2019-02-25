'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');

const featurePrompts = require('../../global/prompts/modules/feature.prompts.js');
const common = require('../../global/common.js');
const constants = require('../../global/constants.js');

let presets;
let parameters = {};

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        parameters = opts.options;

        var presetOptions = common.GetConfig(parameters.Testing);

        if (typeof(presetOptions) != 'undefined' && presetOptions != null) {
            presets = presetOptions.Generators;
        }
    }

    init() {
        this.log(chalk.blue('Create a Feature Module...'));
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option set
        let prompts = common.TrimPrompts(featurePrompts, presets);

        if (typeof(prompts) != 'undefined') {
            return this.prompt(prompts).then((answers) => {
                this._processParameters(answers, presets);
            });
        } else {
            this._processParameters(null, presets);
        }
    }

    _processParameters(answers, presets) {
        parameters.ModuleName = common.ProcessParameter(answers, presets, constants.MODULE_NAME);
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
                Parameters: parameters
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('./code/.Sitecore.Feature.csproj'),
            this.destinationPath(path.join(this.targetPath, 'code', parameters.SolutionPrefix + '.Feature.' + parameters.ModuleName + '.csproj')), {
                Parameters: parameters,
                ProjectGuid: `{${this.ProjectGuid}`
            }
        );
    }

    packages() {

        this.fs.copyTpl(
            this.templatePath('./code/.packages.config'),
            this.destinationPath(path.join(this.targetPath, 'code', 'packages.config')), {
                Parameters: parameters
            }
        );
        
    }

    assembly() {

        this.fs.copyTpl(
            this.templatePath('./code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.targetPath, 'code/Properties', 'AssemblyInfo.cs')), {
                Parameters: parameters
            }
        );
    }

    codeGeneration() {
        if (parameters.ModuleHasTemplates == true) {
            this.fs.copyTpl(
                this.templatePath('./code/.CodeGen.config'),
                this.destinationPath(path.join(this.targetPath, 'code/', 'CodeGen.config')), {
                    Parameters: parameters
                }
            );
        }
    }

    configureSerializedItems() {

        // Create Unique Id's for Serialized Items
        parameters.UnicornTemplateId = guid.v4();
        parameters.UnicornRenderingId = guid.v4();
        parameters.UnicornMediaId = guid.v4();

        this.fs.copyTpl(
            this.templatePath('./serialization/Templates/.Template.yml'),
            this.destinationPath(path.join(this.targetPath, 'serialization/', 'Templates/', parameters.ModuleName + '.yml')), {
                Parameters: parameters
            }
        );

        this.fs.copyTpl(
            this.templatePath('./serialization/Renderings/.Rendering.yml'),
            this.destinationPath(path.join(this.targetPath, 'serialization/', 'Renderings/', parameters.ModuleName + '.yml')),{
                Parameters: parameters
            }
        );

        this.fs.copyTpl(
            this.templatePath('./serialization/Media/.Media.yml'),
            this.destinationPath(path.join(this.targetPath, 'serialization/', 'Layout/', parameters.ModuleName + '.yml')),
            {
                Parameters: parameters
            }
        );

    }

    solutionAttach() {

        common.addProjectToSolution("feature", this.destinationPath(), this.ProjectGuid, parameters.SolutionPrefix, parameters.ModuleName);

    }
}