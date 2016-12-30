angular.module('app.data.videos').service('ChannelsSrv', function(DataBaseCtrl) {
    DataBaseCtrl.call(this);

    this.id = 'channels';
    this.name = 'Kanäle';
    this.schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                default: ''
            },
            username: {
                type: 'string',
                default: ''
            },
            channelId: {
                type: 'string',
                default: ''
            },
            playlistId: {
                type: 'string',
                default: ''
            },
            description: {
                type: 'string',
                default: ''
            },
            title: {
                type: 'string',
                default: ''
            },
            image: {
                type: 'string',
                default: ''
            }
        }
    };

    return this;
});

registerVideoDataService('channels', 'ChannelsSrv');
