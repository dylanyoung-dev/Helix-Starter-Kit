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

        return this.prompt(prompts).then((answers) => {

            // Define Parameters to Use Throughout File
            this.SolutionName = common.ProcessParameter(answers.SolutionName, presets, "SolutionName");
            this.SitecoreVersion = common.ProcessParameter(answers.SitecoreVersion, presets, "SitecoreVersion");
            this.SolutionType = common.ProcessParameter(answers.SolutionType, presets, "SolutionType");
            this.SolutionPrefix = common.ProcessParameter(answers.SolutionPrefix, presets, "SolutionPrefix");
            this.EnvironmentRoot = common.ProcessParameter(answers.EnvironmentRoot, presets, "EnvironmentRoot");
            this.EnvironmentUrl = common.ProcessParameter(answers.EnvironmentUrl, presets, "EnvironmentUrl");

        });
    }

    runGenerator() {

        // Run Base Sub Generator
        this.composeWith(require.resolve('/base/'));

        // Run Sub Generator Based on Solution Type Selected
        this.composeWith(require.resolve(`/${this.SolutionType}`));
    }
}

/* module.exports = generators.Base({
    end: function () {
        var done = this.async();

        console.log('Just Testing');
        //this.spawnCommand('createdb.cmd').on('close', done);
    }
}); */