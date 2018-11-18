'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');

const websitePrompts = require('../../global/prompts/website.solution.prompts.js');
const common = require('../../global/common.js');
const constants = require('../../global/constants.js');
const presets = common.GetConfig();

let parameters = {};

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        parameters = opts.options;
    }

    init() {
        this.log(chalk.blue('Running Website Sub-Generator'));
    }

    prompting() {

        // Only Prompt for Questions that don't have a preset config option
        var prompts = common.TrimPrompts(websitePrompts, presets.Generators);

        return this.prompts(prompts).then((answers) => {
            parameters.WebsiteName = common.ProcessParameter(answers.WebsiteName, presets, constants.WEBSITE_NAME);
        });

    }

    runGenerator() {
        _SetupWebsiteProject();
        _SetupCommonProject();
    }

    _SetupWebsiteProject() {
        this.fs.copyTpl(
            this.templatePath('src/Project/Website'),
            this.destinationPath()
        );
    }

    _SetupCommonProject() {

    }

}