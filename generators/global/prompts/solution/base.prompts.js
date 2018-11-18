`use strict`;

module.exports = [{
    type: 'input',
    name: 'SolutionName',
    message: 'Enter the name for the Solution File (ie. HelixStarterKit.sln):'
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
