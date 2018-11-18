'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');

const modulePrompts = require('../global/prompts/');
const common = require('../global/common.js');
const constants = require('../global/constants.js');
const presets = common.GetConfig();

let parameters = {};

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        parameters = opts.options;
    }

    init() {
        this.log(chalk.green('Creating a Module...'));
    }

    prompting() {
        
        // Only Prompt for Questions that don't have a preset config option
        let prompts = common.TrimPrompts(modulePrompts, presets.Generators);

        return this.prompt(prompts).then((answers) => {

            parameters.GeneratorModuleType = common.ProcessParameter(answers.GeneratorModuleType, presets, constants.GENERATOR_MODULE_TYPE);

        });
    }

    runGenerator() {

        // Run Sub-Generator Based on Module Type
        this.composeWith(require.resolve(`../create-module/helix-${parameters.GeneratorModuleType}`), { options: parameters });

    }

}