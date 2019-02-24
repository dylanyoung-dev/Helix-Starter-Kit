'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('merge-config');
var guid = require('node-uuid');

var exec = require('child_process').exec,
    child;

module.exports = {

    GetConfig(ignore) {

        // Ignore Configuration During Most Tests
        if (typeof(ignore) != 'undefined' && ignore == true) {
            return null;
        } 

        let mergeConfig = new merge();

        // Load Primary Configuration
        mergeConfig.file(path.join(__dirname, '../config.yaml'));

        // TODO: Figure out why it won't overwrite main config correctly
        if (fs.existsSync(path.join(__dirname, '../config.local.yaml'))) 
        {
            mergeConfig.file(path.join(__dirname, '../config.local.yaml'));
        }

        let config = mergeConfig.get();

        return config;
    },

    /**
     * @param  {String} promptAnswer
     * @param  {Array} presets
     * @param  {String} presetName
     */
    ProcessParameter(answers, presets, presetName) {
        if (typeof (presets) == 'undefined') {
            return answers[presetName];
        }

        let preset = presets.find(function (x) {
            return x.name == presetName;
        });

        if ((typeof (preset) == 'undefined') || (typeof (preset.value) == 'undefined')) {
            return answers[presetName];
        }

        return preset.value;
    },

    /**
     * @param  {Array} prompts
     * @param  {Array} presets
     */
    TrimPrompts(prompts, presets) {

        // Prompts for Step is Null, return Null
        if (typeof (prompts) == 'undefined') {
            return null;
        }

        // Presets are empty, returns the prompts
        if (typeof (presets) == 'undefined') {
            return prompts;
        }

        var filtered = prompts.filter(function (x) {
            return !presets.find(function (y) {
                return y.name == x.name && (typeof (y.value) != 'undefined');
            });
        });

        return filtered;
    },

    /**
     * @param  {} slnText
     * @param  {} name
     * @param  {} ordering
     */
    ensureSolutionSection(slnText, name, ordering) {
        if (slnText.toString().includes(`GlobalSection(${name})`) == false) {
            let sectionText =
                `	GlobalSection(${name}) = ${ordering}\r\n` +
                `	EndGlobalSection`;

            slnText = slnText.replace(/\r\nGlobal\s*\r\n/, `$&${sectionText}\r\n`);
        }

        return slnText;
    },

    titleCase(str) {
        return str.toLowerCase().split(' ').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    },

    handleItems(startPath, outputPath, parameters) {

        this.fs.copyTpl(
            this.templatePath(startPath),
            this.destinationPath(outputPath), {
                Parameters: parameters,
                Id: guid.v4()
            }
        );

    },

    addProjectToSolution(layer, destinationPath, projectId, solutionPrefix, moduleName) {

        let slnFilePath = this.getSolutionFilePath(destinationPath);

        if (typeof(slnFilePath) == 'undefined') {
            return;
        }

        let slnText = fs.readFileSync(slnFilePath, 'utf8');

        // Stop Process if Project Already Exists in the Solution (for any reason)
        if (slnText.indexOf(`${solutionPrefix}.${this.titleCase(layer)}.${moduleName}.csproj`) > -1) {
            this.log('Module already exists in the solution.')
            return;
        }

        slnText = this.ensureSolutionSection(slnText, 'ProjectConfigurationPlatforms', 'postSolution');
        slnText = this.ensureSolutionSection(slnText, 'NestedProjects', 'preSolution');

        let projectFolderGuid = guid.v4();

        let projectDefinition =
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${solutionPrefix}.${this.titleCase(layer)}.${moduleName}", "src\\${this.titleCase(layer)}\\${moduleName}\\code\\${solutionPrefix}.${this.titleCase(layer)}.${moduleName}.csproj", "{${projectId}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${moduleName}", "${moduleName}", "{${projectFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig =
            `		{${projectId}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${projectId}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${projectId}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${projectId}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = this.ensureSolutionFolder(slnText, this.titleCase(layer));
        let layerFolderGuid = this.getSolutionFolderGuid(slnText, this.titleCase(layer));

        let projectNesting =
            `		{${projectId}} = {${projectFolderGuid}}\r\n` +
            `		{${projectFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/MinimumVisualStudioVersion[^\r\n]*/, `$&\r\n${projectDefinition}\r\n`);
        slnText = slnText.replace(/[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*/, `$&\r\n${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*/, `$&\r\n${projectNesting}\r\n`);

        fs.writeFileSync(slnFilePath, slnText, 'utf-8');
    },

    ensureSolutionFolder(slnText, folderName) {
        let folderGuid = this.getSolutionFolderGuid(slnText, folderName);

        if (!folderGuid) {
            folderGuid = UUID();

            let folderDefinition =
                `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${folderName}", "${folderName}", "{${folderGuid}}"\r\n` +
                `EndProject`

            slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${folderDefinition}\r\n`);
        }

        return slnText;
    },

    getSolutionFolderGuid(slnText, folderName) {
        let regex = new RegExp(`Project\\("{2150E333-8FDC-42A3-9474-1A3956D46DE8}"\\) = "[0-9\. ]*${folderName}", "[0-9\. ]*${folderName}", "{(.+)}"`);
        let matches = slnText.match(regex);

        return matches && matches[1];
    },

    getSolutionFilePath(destPath) {
        let slnFile =
            fs.readdirSync(destPath)
                .find(_ => _.endsWith('.sln'));

        return slnFile && path.join(destPath, slnFile);
    },

    installDependencies() {
        child = exec('npm install', function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }
};