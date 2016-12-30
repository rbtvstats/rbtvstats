angular.module('app.data.videos').service('HostsSrv', function(DataBaseCtrl) {
    DataBaseCtrl.call(this);

    this.id = 'hosts';
    this.name = 'Moderatoren';
    this.schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                default: ''
            },
            firstname: {
                type: 'string',
                default: ''
            },
            lastname: {
                type: 'string',
                default: ''
            },
            nickname: {
                type: 'string',
                default: ''
            },
            description: {
                type: 'string',
                default: ''
            },
            links: {
                type: 'array',
                default: []
            },
            image: {
                type: 'string',
                default: ''
            }
        }
    };

    return this;
});

registerVideoDataService('hosts', 'HostsSrv');
