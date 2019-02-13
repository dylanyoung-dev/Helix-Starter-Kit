`use strict`;

const constants = require('../../constants.js');

module.exports = [{
    type: 'input',
    name: constants.SOLUTION_NAME,
    message: 'Enter the name for the Solution File (ie. HelixStarterKit.sln):'
}, {
    type: 'input',
    name: constants.ENVIRONMENT_URL,
    message: 'What is the Url to your local Sitecore environment:',
    defaultValue: 'https://starterkit.sc' 
}, {
    type: 'input',
    name: constants.ENVIRONMENT_ROOT,
    message: 'Path to your Sitecore Root on your file system:',
    defaultvalue: 'c:\inetpub\wwwroot\starterkit.sc'
}, {
    type: 'list',
    name: constants.SOLUTION_TYPE,
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
