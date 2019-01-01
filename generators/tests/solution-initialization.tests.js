const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const rimraf = require('rimraf');

const deps = [
    [helpers.createDummyGenerator(), 'starter:app'],
    path.join(__dirname, '../solution-setup'),
    path.join(__dirname, '../solution-setup/base'),
    path.join(__dirname, '../solution-setup/website'),
    path.join(__dirname, '../solution-setup/module'),
    path.join(__dirname, '../create-module')
];

var MyGenerator = require(path.join(__dirname, '../app'));

describe('Solution Initialization Tests', () => {

    const solutionPrefix = 'Helix';
    const solutionName = 'HelixBase';

    beforeEach(() => {
        return helpers.run(MyGenerator, {
            namespace: 'starter:app'
        })
            .inDir(path.join(__dirname, 'tmp'))
            .withPrompts({
                SolutionPrefix: solutionPrefix,
                SitecoreVersion: '9.0.2',
                GeneratorType: 'initialize',
                SolutionName: solutionName,
                SolutionType: 'base',
                EnvironmentUrl: 'https://starterkit.sc',
                EnvironmentRoot: 'c:\\inetpub\\wwwroot\\starterkit.sc'
            })
            .withOptions(
                { testing: true }
            )
            .withGenerators(deps);
    });
    afterEach(() => {
        rimraf.sync(path.join(__dirname, 'tmp'));
    });

    it('Generate Solution Files', (done) => {
        // The object returned acts like a promise, so return it to wait until the process is done
        assert.file(path.join(__dirname, `tmp/gulpfile.js`));
        assert.file(path.join(__dirname, `tmp/${solutionName}.sln`));

        done();
    });

    it('Correct Version Nuget File - 9.1', (done) => {
        assert.file(path.join(__dirname, `tmp/Nuget.config`));
        //assert.fileContent(path.join(__dirname, `tmp/NuGet.config`), '');

        done();
    });

});