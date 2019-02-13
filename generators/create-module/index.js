'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');

const modulePrompts = require('../global/prompts/modules/base.prompts.js');
const common = require('../global/common.js');
const constants = require('../global/constants.js');

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
        this.log(chalk.blue('Creating a Module...'));
    }

    prompting() {
        
        // Only Prompt for Questions that don't have a preset config option
        let prompts = common.TrimPrompts(modulePrompts, presets);

        if (typeof(prompts) != 'undefined') {
            return this.prompt(prompts).then((answers) => {
                this._processParameters(answers, presets);
            });
        } else {
            this._processParameters(null, presets);
        }
    }

    _processParameters(answers, presets) {
        parameters.GeneratorModuleType = common.ProcessParameter(answers, presets, constants.GENERATOR_MODULE_TYPE);
        parameters.ModuleHasTemplates = common.ProcessParameter(answers, presets, constants.MODULE_HAS_TEMPLATES);
    }

    runGenerator() {

        // Run Sub-Generator Based on Module Type
        this.composeWith(require.resolve(`../create-module/helix-${parameters.GeneratorModuleType}`), { options: parameters });

    }

}