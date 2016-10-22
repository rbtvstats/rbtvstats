'use strict';

/**
 * @ngdoc service
 * @name rbtvstatsApp.storage
 * @description
 * # storage
 * Service in the rbtvstatsApp.
 */
app.service('storageSrv', function(localStorageService) {
    var service = {};

    var defaultConfig = {
        channels: ['ROCKETBEANSTV', 'RocketbeansLetsPlay'],
        hosts: ['Lisa', 'Viet', 'Robin', 'Michael T', 'Yannic', 'Mental', 'Blitz', 'Tobias E', 'Dima', 'Jay', 'Timo', 'Charly', 'Katharina', 'Felix', 'Arno', 'Luise', 'Andi', 'Ian', 'Anja', 'Niklas', 'Ralph', 'Oli', 'Andreas', 'Florentin', 'Lars', 'Sia', 'Colin', 'Budi', 'Eddy', 'Nils', 'Simon', 'Alwin', 'Bell', 'Ben', 'Schröck', 'Dennis H', 'Dennis R', 'Eduard', 'Fabian', 'Flo', 'Gino', 'Gregor', 'Gunnar', 'Hannes', 'Jan', 'Jens', 'Leandra', 'Madlin', 'Marco', 'Max', 'Michael K', 'Michael R', 'Miriam', 'Nasti', 'Rene', 'Sofia', 'Steffen', 'Tim H', 'Tim G', 'Hauke', 'Isa', 'Johannes', 'Uke'],
        shows: ['News', '[Event] RBTV Euro 2016', '[Event] WaTaWorld', '[Event] NBA 2k16 Zock4-Turnier', '[Event] Die lange Final Fantasy-Nacht', '[Event] Beans on Ice', '[Event] Das große World of Tanks Manöver', '[Event] Street Fighter V Turnier', '[Event] Call of Duty: Black Ops III Beta Launch', '[Event] FIFA 16 Launch Turnier', '[Event] Sommerfest 2016', '[Event] Sommerfest 2015', '[Event] Fallout 24h', 'Photochopped', 'Baking Bad', 'Philosofa', '1on1', 'Hearthstoned', 'Rocketminers', 'Couch an Couch', 'Build Schön', 'Die Reddit Show', 'Der Superfan', 'Bohn Jour', 'Q&A', 'Beans On Rice', 'Press Select', 'Panelz', 'TILT', 'Bohndesliga', 'TheraThiel', 'Buch Klub', 'Almost Daily', 'Almost Plaily', 'Gadget Inspectors', 'SRSLY', 'Verflixxte Klixx', 'MoinMoin', 'Wir müssen reden', '30 Sekunden über...', 'Chat Duell', 'Die Wikishow', 'Dosenbeatz', 'Erwachsene Männer hören Jan Tenner', 'German Treasure Hunter', 'Gino+', 'Mate Knights', 'Pen & Paper', 'Roadtrip: Budi Bros go Minsk', 'Rocket Beans on tour', 'Smarter Phone', 'Social Viewing Night', 'Stumble TV', 'Super Competition Club', 'Was kommen könnte', 'Weekly Wahnsinn', 'Schröcks Fernsehgarten', 'Kino+ Spezial', 'Kino+', 'Dosenbeatz', 'Screentrips', 'Mayfeld & Bloomkamp', 'Lost in Fiction', 'Game+ Daily', 'Game+', 'Industrie Skypeorama', 'Nerd Quiz', 'Retro Klub', 'Evil is Quatsching', 'Royal Beef', 'Brett & Breakfast', 'After Dark', 'Call of Budi', 'Classix', 'Community Beef', 'Gamedown to Star Wars Episode VIII', 'Knallhart Durchgenommen', 'Point & Chick', 'Road To Division One', 'Spiele mit Bart', 'Straight To Gold', 'Zocken mit Bohnen', 'Spoiler', 'Speedrundale', 'Die Arcademiker', 'Double Screen', 'Monster Hunter 3 Ultimate Tutorials', 'Oculust', 'Spiele mit Schmerz', 'Los Santos Connection', 'Indie Tonne', 'Irgendwas mit Zombies', 'Simonster', 'Lets Play', 'Beans vs', '[Event] E3 2015', '[Event] Dreamhack 2016', '[Event] WCS 2015', '[Event] Gamescom 2015', 'Perlen From The Past', '[Event] Archon Cup'],
        series: [],
        fullScreen: false,
        youtubeApiKey: ''
    };

    service.getConfig = function() {
        var config = localStorageService.get('config');
        if (!config) {
            config = defaultConfig;
            service.setConfig(defaultConfig);
        }

        return config;
    };

    service.setConfig = function(config) {
        if (typeof config === 'undefined') {
            return localStorageService.remove('config');
        } else {
            return localStorageService.set('config', config);
        }
    };

    service.getMetadata = function() {
        return localStorageService.get('metadata') || {};
    };

    service.setMetadata = function(metadata) {
        if (typeof metadata === 'undefined') {
            return localStorageService.remove('metadata');
        } else {
            return localStorageService.set('metadata', metadata);
        }
    };

    return service;
});
