'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var mkdirp = require('mkdirp');
var guid = require('node-uuid');

module.exports = class extends Generator {

    constructor(args, opts) { 
        super(args, opts); 
    }

    init() {
        this.log(yosay('welcome'));

        this._prompting();
    }

    _prompting() {
        return this.prompt(typePrompts).then((answers) => {
            if (answers.type === 'helixProject') {

            }

            if (answers.type === 'helixFeature')
            {

            }

            if (answers.type === 'helixFoundation') 
            {

            }
        });
    }
};