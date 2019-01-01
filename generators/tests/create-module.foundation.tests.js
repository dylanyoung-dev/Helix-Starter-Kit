const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const rimraf = require('rimraf');

const deps = [
    [helpers.createDummyGenerator(), 'starter:app'],
    path.join(__dirname, '../create-module'),
    path.join(__dirname, '../solution-setup'),
    path.join(__dirname, '../solution-setup/base'),
    path.join(__dirname, '../solution-setup/website'),
    path.join(__dirname, '../solution-setup/module'),
    path.join(__dirname, '../create-module/helix-foundation')
];

var MyGenerator = require(path.join(__dirname, '../app'));

describe('Create Foundation Module Tests', (done) => {

    // Constants
    const moduleName = "Tests";
    const solutionPrefix = "Helix";
    const solutionName = "HelixBase";

    beforeEach((done) => {
        return Promise.resolve(helpers.run(MyGenerator, {
            namespace: 'starter:app'
        })
            .inDir(path.join(__dirname, 'tmp'))
            .withPrompts({
                SolutionPrefix: solutionPrefix,
                SitecoreVersion: '9.0.2',
                GeneratorType: 'create-module',
                SolutionName: solutionName,
                EnvironmentUrl: 'https://starterkit.sc',
                EnvironmentRoot: 'c:\\inetpub\\wwwroot\\starterkit.sc',
                ModuleName: moduleName,
                GeneratorModuleType: 'foundation'
            })
            .withGenerators(deps)).then(function () {
                done();
            });
    });
    afterEach(() => {
        rimraf.sync(path.join(__dirname, 'tmp'));
    });

    it('Generate Foundation Files', (done) => {

        assert.file(path.join(__dirname, `tmp/src/Foundation/${moduleName}/code/${solutionPrefix}.Foundation.${moduleName}.csproj`));

        done();

    });
});