'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');

const common = require('../global/common.js');
const presets = common.GetConfig();

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
    }

    init() {
        this.log(chalk.blue('Running Website Sub Generator'));
    }

    prompting() {
        // Run Generator Specific Prompts (if any)
    }

    runGenerator() {
        // Run Generator Methods
    }

}