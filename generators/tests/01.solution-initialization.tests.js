const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');
const rimraf = require('rimraf');
const exec = require('child_process').exec;

const deps = [
    [helpers.createDummyGenerator(), 'starter:app'],
    path.join(__dirname, '../solution-setup'),
    path.join(__dirname, '../solution-setup/base'),
    path.join(__dirname, '../solution-setup/website'),
    path.join(__dirname, '../solution-setup/module'),
    path.join(__dirname, '../create-module')
];

var MyGenerator = require(path.join(__dirname, '../app'));

describe('Solution Initialization Tests - 9.1.0', () => {
    const solutionPrefix = 'Helix';
    const solutionName = 'HelixBase';

    beforeEach(() => {
        return helpers.run(MyGenerator, {
            namespace: 'starter:app'
        })
            .inDir(path.join(__dirname, 'tmp'))
            .withPrompts({
                SolutionPrefix: solutionPrefix,
                SitecoreVersion: '9.1.0',
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
        //rimraf.sync(path.join(__dirname, 'tmp'));
    });

    it('Generate Solution Files', (done) => {
        // The object returned acts like a promise, so return it to wait until the process is done
        assert.file(path.join(__dirname, `tmp/gulpfile.js`));
        assert.file(path.join(__dirname, `tmp/${solutionName}.sln`));

        done();
    });
});

describe('Solution Initialization Tests - 9.0.2', () => {

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
        //rimraf.sync(path.join(__dirname, 'tmp'));
    });

    it('Generate Solution Files', (done) => {
        // The object returned acts like a promise, so return it to wait until the process is done
        assert.file(path.join(__dirname, `tmp/gulpfile.js`));
        assert.file(path.join(__dirname, `tmp/${solutionName}.sln`));

        done();
    });

});

describe('Solution Initialization Tests - 9.0.1', () => {
    const solutionPrefix = 'Helix';
    const solutionName = 'HelixBase';

    beforeEach(() => {
        return helpers.run(MyGenerator, {
            namespace: 'starter:app'
        })
            .inDir(path.join(__dirname, 'tmp'))
            .withPrompts({
                SolutionPrefix: solutionPrefix,
                SitecoreVersion: '9.0.1',
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
        //rimraf.sync(path.join(__dirname, 'tmp'));
    });

    it('Generate Solution Files', (done) => {
        // The object returned acts like a promise, so return it to wait until the process is done
        assert.file(path.join(__dirname, `tmp/gulpfile.js`));
        assert.file(path.join(__dirname, `tmp/${solutionName}.sln`));

        done();
    });

    it.skip('Run a Solution Build', (done) => {
        // Run MSBuild Command
        exec(`"C:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\MSBuild\\15.0\\Bin\\msbuild.exe" ${solutionName}.sln /t:Build /p:Configuration=Debug`, function (err, stdout, stderr) {
            console.log(stderr);
            assert.equal(0, stderr.length);

            done();
        });

        done();
    });
});