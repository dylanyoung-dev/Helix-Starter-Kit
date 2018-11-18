'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

const introPrompts = require('../global/prompts/intro.prompts.js');
const common = require('../global/common.js');
const constants = require('../global/constants.js');
const presets = common.GetConfig();

let parameters = {};

module.exports = class extends Generator {

    constructor(args, opts) { 
        super(args, opts); 
    }

    init() {
        this.log(yosay('welcome to ' + chalk.magenta('Helix Starter Kit') + ' Yeoman generator!'));
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option
        var prompts = common.TrimPrompts(introPrompts, presets.Generators);

        return this.prompt(prompts).then((answers) => {
            parameters.GeneratorType = common.ProcessParameter(answers.GeneratorType, presets, constants.GENERATOR_TYPE);
        });
    }

    runGenerator() {

        if (parameters.GeneratorType === 'initialize') {

            // Solution Initialization
            this.composeWith(require.resolve('../solution-setup/'), { options: parameters });

        }

        if (parameters.GeneratorType === 'create-module') {

            // Create New Module Prompts
            this.composeWith(require.resolve('../create-module/'), { options: parameters });

        }

    }

};