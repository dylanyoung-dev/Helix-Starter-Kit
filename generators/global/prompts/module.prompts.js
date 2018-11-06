'use strict';

module.exports = [{
    type: 'list',
    name: 'type',
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
}];

