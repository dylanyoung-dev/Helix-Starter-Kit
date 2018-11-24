/* eslint-env jest, mocha */

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const rimraf = require('rimraf');

describe('Base Solution Initialization Tests', function() {

    beforeEach(function() {
        return helpers.run('../../../../app/index.js')
            .inDir(path.join(__dirname, 'tmp'))
            .withPrompts({
                SolutionPrefix: 'Helix',
                SitecoreVersion: '9.0.180',
                SolutionName: 'HelixBase',
                GeneratorType: 'base'
            });
    });

    afterEach(() => {
        rimraf.sync(path.join(__dirname, 'tmp'));
    });

    it('Basic Solution File', function() {
        assert.file("HelixBase.sln");
    });

    it('simple test', function() {
        assert.ok(true);
    });

});