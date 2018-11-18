'use strict';

var Generator = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var mkdir = require('mkdirp');
var guid = require('node-uuid');
var foreach = require('foreach');

const solutionPrompts = require('../global/prompts/solution.prompts.js');
const common = require('../global/common.js');
const presets = common.GetConfig();

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log('Solution Initialization');
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option
        var prompts = common.TrimPrompts(solutionPrompts, presets.Generators);
        this.variables = {};

        return this.prompt(prompts).then((answers) => {

            // Define Parameters to Use Throughout File
            this.variables.SolutionName = common.ProcessParameter(answers.SolutionName, presets, "SolutionName");
            this.variables.SitecoreVersion = common.ProcessParameter(answers.SitecoreVersion, presets, "SitecoreVersion");
            this.variables.SolutionType = common.ProcessParameter(answers.SolutionType, presets, "SolutionType");
            this.variables.SolutionPrefix = common.ProcessParameter(answers.SolutionPrefix, presets, "SolutionPrefix");
            this.variables.EnvironmentRoot = common.ProcessParameter(answers.EnvironmentRoot, presets, "EnvironmentRoot");
            this.variables.EnvironmentUrl = common.ProcessParameter(answers.EnvironmentUrl, presets, "EnvironmentUrl");

        });
    }

    runGenerator() {

        // Run Base Sub Generator
        this.composeWith(require.resolve('../solution-setup/base/'), { options: this.variables });

        // Run Sub Generator Based on Solution Type Selected
        if (this.variables.SolutionType != "Base") {
            this.composeWith(require.resolve(`/${this.variables.SolutionType.ToLower()}/`), { options: this.variables });
        }
    }
}