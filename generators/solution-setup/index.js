'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');
var foreach = require('foreach');

const solutionPrompts = require('../global/prompts/solution/base.prompts.js');
const common = require('../global/common.js');
const constants = require('../global/constants.js');

let presets;
let parameters = {};

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);

        parameters = opts.options;

        let isTesting = true;

        var presetOptions = common.GetConfig(isTesting);

        if (typeof(presetOptions) != 'undefined' && presetOptions != null) {
            presets = presetOptions.Generators;
        }
    }

    init() {
        this.log(chalk.magenta('Initializing Your Sitecore Solution...'));
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option
        var prompts = common.TrimPrompts(solutionPrompts, presets);

        if (typeof(prompts) != 'undefined') {
            return this.prompt(prompts).then((answers) => {
                this._processParameters(answers, presets);
            });
        } else {
            this._processParameters(null, presets.Generators);
        }
    }

    /// Process Parameters from Prompts & Presets
    _processParameters(answers, presets) {
        parameters.SolutionName = common.ProcessParameter(answers, presets, constants.SOLUTION_NAME);
        parameters.SolutionType = common.ProcessParameter(answers, presets, constants.SOLUTION_TYPE);
        parameters.EnvironmentRoot = common.ProcessParameter(answers, presets, constants.ENVIRONMENT_ROOT);
        parameters.EnvironmentUrl = common.ProcessParameter(answers, presets, constants.ENVIRONMENT_URL);
    }

    runGenerator() {

        // Run Base Sub Generator
        this.composeWith(require.resolve('../solution-setup/base/'), { options: parameters });

        // Run Sub Generator Based on Solution Type Selected
        if (parameters.SolutionType.toLowerCase() != "base") {
            this.composeWith(require.resolve(`/${parameters.SolutionType.toLowerCase()}/`), { options: parameters });
        }

        // Run NPM Install + Gulp Initialize Task (TODO)
        common.installDependencies();
    }
}