'use strict';

module.exports = [{
    type: 'list',
    name: 'GeneratorType',
    message: 'What action do you want to perform?',
    choices: [{
        name: 'Initialize Solution',
        value: 'initialize'
    },
    {
        name: 'Create Helix Module',
        value: 'create-module'
    }]
}, {
    type: 'list',
    name: 'SitecoreVersion',
    message: 'What version of Sitecore are you using?',
    choices: [{
        name: '9.1.0 (001564)',
        value: '9.1.0'
    },{
        name: '9.0.2 (180604)',
        value: '9.0.2'  
    },{
        name: '9.0.1 (171219)',
        value: '9.0.1'
    }]
}, {
    type: 'input',
    name: 'SolutionPrefix',
    message: 'Enter the name of the Solution Prefix (ie. *Sitecore*.Project.Common or *Helix*.Foundation.Orm):',
    defaultvalue: 'Helix'
}];