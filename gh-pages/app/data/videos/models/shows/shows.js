angular.module('app.data.videos').service('ShowsSrv', function(DataBaseCtrl) {
    DataBaseCtrl.call(this);

    this.id = 'shows';
    this.name = 'Formaten';
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
            event: {
                type: 'boolean',
                default: false
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

    this.addSeries = function(show, series) {
        if (!angular.isArray(series)) {
            series = [series];
        }

        show.series = show.series || [];
        var count = 0;
        for (var i = 0; i < series.length; i++) {
            var series_ = series[i];
            if (show.series.indexOf(series_.id) === -1) {
                show.series.push(series_.id);
                count++;
            }
        }

        return count;
    };

    this.removeSeries = function(show, series) {
        if (!angular.isArray(series)) {
            series = [series];
        }

        show.series = show.series || [];
        var count = 0;
        for (var i = 0; i < series.length; i++) {
            var series_ = series[i];
            var index = show.series.indexOf(series_.id);
            if (index > -1) {
                show.series.splice(index, 1);
                count++;
            }
        }

        return count;
    };

    return this;
});

registerVideoDataService('shows', 'ShowsSrv');
