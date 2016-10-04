chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.action === 'start') {
        console.log('start');
        tweets = {};
        active = true;
    } else if (msg.action === 'stop') {
        console.log('stop');
        active = false;
    }
});
