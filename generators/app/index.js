'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
//var path = require('path');
//var mkdirp = require('mkdirp');
//var guid = require('node-uuid');

const introPrompts = require('../global/prompts/intro.prompts.js');

module.exports = class extends Generator {

    constructor(args, opts) { 
        super(args, opts); 
    }

    init() {
        this.log(yosay('welcome to ' + chalk.magenta('Helix Starter Kit') + ' Yeoman generator!'));

        this._prompting();
    }

    _prompting() {
        return this.prompt(introPrompts).then((answers) => {
            if (answers.type === 'project') {

            }

            if (answers.type === 'feature')
            {
                this.composeWith(require.resolve('../helix-feature/'));
            }

            if (answers.type === 'foundation') 
            {

            }
        });
    }
};