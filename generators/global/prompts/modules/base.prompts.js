'use strict';

const constants = require('../../constants.js');

module.exports = [{
    type: 'list',
    name: constants.GENERATOR_MODULE_TYPE,
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
    name: constants.MODULE_HAS_TEMPLATES,
    message: 'Module will have Templates?',
    choices: [{
        name: 'Yes',
        value: "true"
    },
    {
        name: "No",
        value: "false"
    }]
}];

