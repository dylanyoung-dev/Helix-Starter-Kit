'use strict';

module.exports = [{
    type: 'list',
    name: 'GeneratorModuleType',
    message: 'What is the layer of the module you are adding?',
    choices: [{
        name: 'Project',
        value: 'project'
    },
    {
        name: 'Feature',
        value: 'feature'
    },
    {
        name: 'Foundation',
        value: 'foundation'
    }]
},
{
    type: 'list',
    name: 'ModuleHasTemplates',
    message: 'Module will have Templates?',
    choices: [{
        name: 'Yes',
        value: true
    },
    {
        name: "No",
        value: false
    }]
}];

