angular.module('app.data.videos').service('SeriesSrv', function(DataBaseCtrl) {
    DataBaseCtrl.call(this);

    this.id = 'series';
    this.name = 'Serien';
    this.schema = {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                default: ''
            },
            name: {
                type: 'string',
                default: ''
            },
            show: {
                type: '$shows',
                default: null
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

registerVideoDataService('series', 'SeriesSrv');
