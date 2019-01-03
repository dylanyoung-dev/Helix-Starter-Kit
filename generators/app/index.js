'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

const introPrompts = require('../global/prompts/intro.prompts.js');
const common = require('../global/common.js');
const constants = require('../global/constants.js');

let presets;
let parameters = {};

module.exports = class extends Generator {

    constructor(args, opts) { 
        super(args, opts); 

        this.argument('testing', { type: Boolean, required: false });

        parameters.Testing = this.options.testing;

        var presetOptions = common.GetConfig(parameters.Testing);

        if (typeof(presetOptions) != 'undefined' && presetOptions != null) {
            presets = presetOptions.Generators;
        }
    }

    init() {
        this.log(yosay('welcome to ' + chalk.magenta('Helix Starter Kit') + ' Yeoman generator!'));
    }

    prompting() {

        var prompts = common.TrimPrompts(introPrompts, presets);

        this.log(chalk.magenta(`Running in Path: ${__dirname} - If this path is wrong, run .\\starter setup`));

        // If Prompts are undefined
        if (typeof(prompts) != 'undefined') {
            return this.prompt(prompts).then((answers) => {
                this._processParameters(answers, presets);
            });
        } else {
            _processParameters(null, presets);
        }
    }

    _processParameters(answers, presets) {

        parameters.GeneratorType = common.ProcessParameter(answers, presets, constants.GENERATOR_TYPE);
        parameters.SolutionPrefix = common.ProcessParameter(answers, presets, constants.SOLUTION_PREFIX);
        parameters.SitecoreVersion = common.ProcessParameter(answers, presets, constants.SITECORE_VERSION);

    }

    configure() {

        // Sitecore 9, 9.1 Run on 4.7.1
        parameters.FrameworkVersion = "4.7.1";

        // Determine Sitecore Version and Set Extra Parameters from Array[Obj]
        let versionOptions = require(`../global/${parameters.SitecoreVersion}/options.js`);

        if (typeof(versionOptions) != 'undefined') {
            parameters.VersionOptions = versionOptions;
        }

        parameters.SourceRoot = this.destinationPath();
    }

    runGenerator() {

        if (parameters.GeneratorType === 'initialize') {

            // Solution Initialization
            this.composeWith(require.resolve('../solution-setup/'), { options: parameters });

        }

        if (parameters.GeneratorType === 'create-module') {

            // let slnPath = common.getSolutionFilePath(this.destinationPath());
            // if (slnPath == '' | typeof(slnPath) == 'undefined')
            // {
            //     this.log(chalk.red('You must initialize your Solution before creating a module.'));
            //     return;
            // }

            // Create New Module Prompts
            this.composeWith(require.resolve('../create-module/'), { options: parameters });

        }

    }

};