const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const rimraf = require('rimraf');

describe('Solution Initialization Tests', function () {

    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {

            console.log(path.join(__dirname, 'temp'));

            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('app:starter.solution', [
                '../../app', [
                    helpers.createDummyGenerator(),
                    'app:starter.solution'
                ]
            ]);
            done();
        }.bind(this));
    });

    it('Solution Exists', function () {

        return helpers.run(this.app).withPrompts({
            SolutionPrefix: 'Helix',
            SitecoreVersion: '9.0.180604',
            SolutionName: 'HelixBase',
            SolutionType: 'base'
        }).withOptions({ skipInstall: true }).then(function() {
            assert.file('s.sln');
        });
        //this.app.options['skip-install'] = true;
        // this.app.run({}, function () {
        //     helpers.assertFile('s.sln');
        //     done();
        // });
    });
});