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
            parameters.SolutionPrefix = common.ProcessParameter(answers.SolutionPrefix, presets, constants.SOLUTION_PREFIX);
            parameters.SitecoreVersion = common.ProcessParameter(answers.SitecoreVersion, presets, constants.SITECORE_VERSION);

        });
    }

    runGenerator() {

        if (parameters.GeneratorType === 'initialize') {

            // Solution Initialization
            this.composeWith("app:starter.solution", { options: parameters }, require.resolve('../solution-setup/'));

        }

        if (parameters.GeneratorType === 'create-module') {

            let slnPath = common.getSolutionFilePath(this.destinationPath());
            if (slnPath == '' | typeof(slnPath) == 'undefined')
            {
                this.log(chalk.red('You must initialize your Solution before creating a module.'));
                return;
            }

            // Create New Module Prompts
            this.composeWith(require.resolve('../create-module/'), { options: parameters });

        }

    }

};