var responseHandler = null;
var scrollTimeout = null;
var tweets = {};

function onLoaded(callback) {
    setTimeout(function() {
        if ($('.js-app-loading:visible').length == 1) {
            onLoaded(callback);
        } else {
            callback();
        }
    }, 1000)
}

function scrollBottom() {
    var container = $('.js-column-scroller');
    container.scrollTop(container[0].scrollHeight - 50);
    scrollTimeout = setTimeout(function() {
        container.scrollTop(container[0].scrollHeight);
        scrollBottom();
    }, 100);
}

function start() {
    console.log('start');
    tweets = {};
    scrollBottom();
}

function stop() {
    console.log('stop');
    clearTimeout(scrollTimeout);
}

function setup() {
    var ele = $('<a class="link-clean cf app-nav-link padding-hl margin-tm with-nav-border-t">start</a>');
    ele.on('click', start);
    $('.js-column-nav-list').append(ele)

    ele = $('<a class="link-clean cf app-nav-link padding-hl margin-tm with-nav-border-t">stop</a>');
    ele.on('click', stop);
    $('.js-column-nav-list').append(ele)
}

onLoaded(setup);
