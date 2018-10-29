`use strict`;

module.exports = [{
    type: 'input',
    name: 'solutionName',
    message: 'Enter the name for the Solution File (ie. HelixStarterKit.sln)'
}, {
    type: 'list',
    name: 'type',
    message: 'What version of Sitecore are you using?',
    choices: [{
        name: '9.1 ()',
        value: '9.1.938'
    }, {
        name: '9.0.2 ()',
        value: '9.0.2.9338'
    }]
}, {
    type: 'list',
    name: 'type',
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
}];