'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('merge-config');

module.exports = {

    GetConfig() {

        let mergeConfig = new merge();

        // Load Primary Configuration
        mergeConfig.file(path.join(__dirname, '../config.yaml'));

        // TODO: Figure out why it won't overwrite main config correctly
        // if (fs.exists(path.join(__dirname, '../config.local.yaml'), function(exists) {
        //     mergeConfig.file(path.join(__dirname, '../config.local.yaml'));
        // }));

        return mergeConfig.get();
    },

    /**
     * @param  {String} promptAnswer
     * @param  {Array} presets
     * @param  {String} presetName
     */
    ProcessParameter(promptAnswer, presets, presetName) {
        if (typeof(presets) == 'undefined' | typeof(presets.Generators) == 'undefined') {
            return promptAnswer;
        }

        //let preset = this.FindObjectByName(presets, presetName);
        let preset = presets.Generators.filter(function (x) {
            return x.name == presetName;
        });

        if (typeof(preset[0]) == 'undefined' | typeof(preset[0].value) == 'undefined') {
            return promptAnswer;
        }

        return preset[0].value;
    },

    /**
     * @param  {Array} prompts
     * @param  {Array} presets
     */
    TrimPrompts(prompts, presets) {

        var filtered = prompts.filter(function(x) {
            return !presets.find(function(y) {
                return y.name == x.name && y.exclude == false && (typeof(y.value) != 'undefined');
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
        if(slnText.toString().includes(`GlobalSection(${name})`) == false) {
            let sectionText =
                `	GlobalSection(${name}) = ${ordering}\r\n` +
                `	EndGlobalSection`;

            slnText = slnText.replace(/\r\nGlobal\s*\r\n/, `$&${sectionText}\r\n`);
        }

        return slnText;
    },

    addProjectToSolution(layer, destinationPath, projectId, solutionPrefix, moduleName) {

        let slnFilePath = common.getSolutionFilePath(destinationPath);

        let slnText = this.fs.read(slnFilePath);

        // Stop Process if Project Already Exists in the Solution (for any reason)
        if (slnText.indexOf(`${solutionPrefix}.${layer}.${moduleName}.csproj`) > -1) {
            this.log('Module already exists in the solution.')
            return;
        }
        
        slnText = common.ensureSolutionSection(slnText, 'ProjectConfigurationPlatforms', 'postSolution');
        slnText = common.ensureSolutionSection(slnText, 'NestedProjects', 'preSolution');

        let projectFolderGuid = guid.v4();

        let projectDefinition =
            `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${solutionPrefix}.${layer}.${moduleName}", "src\\${layer}\\${moduleName}\\code\\${solutionPrefix}.${layer}.${moduleName}.csproj", "{${projectId}}"\r\n` +
            `EndProject\r\n` +
            `Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "${moduleName}", "${moduleName}", "{${projectFolderGuid}}"\r\n` + `EndProject\r\n`;

        let projectBuildConfig = 
            `		{${this.ProjectGuid}}.Debug|Any CPU.ActiveCfg = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Debug|Any CPU.Build.0 = Debug|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.ActiveCfg = Release|Any CPU\r\n` +
            `		{${this.ProjectGuid}}.Release|Any CPU.Build.0 = Release|Any CPU\r\n`;

        slnText = common.ensureSolutionFolder(slnText, "Project");
        let layerFolderGuid = common.getSolutionFolderGuid(slnText, "Project");

        let projectNesting =
            `		{${projectId}} = {${projectFolderGuid}}\r\n` +
            `		{${projectFolderGuid}} = {${layerFolderGuid}}\r\n`;

        slnText = slnText.replace(/\r\nMinimumVisualStudioVersion[^\r\n]*\r\n/, `$&${projectDefinition}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(ProjectConfigurationPlatforms\)[^\r\n]*\r\n/, `$&${projectBuildConfig}\r\n`);
        slnText = slnText.replace(/\r\n[^\r\n]*GlobalSection\(NestedProjects\)[^\r\n]*\r\n/, `$&${projectNesting}\r\n`);

        this.fs.write(slnFilePath, slnText);
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
    }
};