'use strict';

module.exports = [{
    type: 'list',
    name: 'type',
    message: 'What action do you want to perform?',
    choices: [{
        name: 'Initialize Solution',
        value: 'initialize'
    },
    {
        name: 'Create Helix Module',
        value: 'create-module'
    }]
}];