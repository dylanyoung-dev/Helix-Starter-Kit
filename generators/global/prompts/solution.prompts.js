`use strict`;

module.exports = [{
    type: 'input',
    name: 'SolutionName',
    message: 'Enter the name for the Solution File (ie. HelixStarterKit.sln):'
}, {
    type: 'input',
    name: 'SolutionPrefix',
    message: 'Enter the name of the Solution Prefix (ie. *Sitecore*.Project.Common or *Helix*.Foundation.Orm):',
    defaultvalue: 'Helix'
}, {
    type: 'input',
    name: 'EnvironmentUrl',
    message: 'What is the Url to your local Sitecore environment:',
    defaultValue: 'https://starterkit.sc' 
}, {
    type: 'input',
    name: 'EnvironmentRoot',
    message: 'Path to your Sitecore Root on your file system:',
    defaultvalue: 'c:\inetpub\wwwroot\starterkit.sc'
}, {
    type: 'list',
    name: 'SitecoreVersion',
    message: 'What version of Sitecore are you using?',
    choices: [{
        name: '9.0.2 (180604)',
        value: '9.0.180604'  
    },{
        name: '9.0.1 (171219)',
        value: '9.0.171219'
    }]
}, {
    type: 'list',
    name: 'SolutionType',
    message: 'What type of project are you going to build?',
    choices: [{
        name: 'Base',
        value: 'base'
    }, {
        name: 'Module Development',
        value: 'module'
    }, {
        name: 'Website',
        value: 'website'
    }]
}]
