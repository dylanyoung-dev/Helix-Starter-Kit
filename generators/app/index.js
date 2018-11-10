'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

const introPrompts = require('../global/prompts/intro.prompts.js');
const modulePrompts = require('../global/prompts/module.prompts.js');
const common = require('../global/common.js');
const presets = common.GetConfig();

module.exports = class extends Generator {

    constructor(args, opts) { 
        super(args, opts); 
    }

    init() {
        this.log(yosay('welcome to ' + chalk.magenta('Helix Starter Kit') + ' Yeoman generator!'));

        this._prompting();
    }

    _prompting() {

        // Only Prompt for Questions that don't have a preset config option
        var prompts = common.TrimPrompts(modulePrompts, presets.Generators);

        console.log(prompts);

        return this.prompt(introPrompts).then((answers) => {
            if (answers.type === 'initialize') {
                // Solution Initialization
                this.composeWith(require.resolve('../initialize-solution/'));
            }

            if (answers.type === 'create-module') {
                // Confirm Solution has been initialized first
                if (!common.getSolutionFilePath(this.destinationPath())) {
                    this.env.error(chalk.bold.red("Error: cannot find a .sln file in the current directory."));
                }

                // Create New Module Prompts
                return this.prompt(modulePrompts).then((moduleanswers) => {
                    if (moduleanswers.type === 'project') {
                        this.composeWith(require.resolve('../helix-project/'));
                    }
        
                    if (moduleanswers.type === 'feature')
                    {
                        this.composeWith(require.resolve('../helix-feature/'));
                    }
        
                    if (moduleanswers.type === 'foundation') 
                    {
                        this.composeWith(require.resolve('../helix-foundation/'));
                    }
                });
            }
        });
    }
};