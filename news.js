var num = 0;
function updateNews() {
    if(num == 0){
        loadNews("http://feeds.nos.nl/nosjournaal")
        num++;
    } else if (num ==1){
        loadNews("http://www.androidpolice.com/feed/")
        num = 0;
    }
}

function loadNews(url) {
    feednami.setPublicApiKey('4c1c5ebc80cc29b2e3ae4ba51cfd275e948dc4e4b76d40c7ded011ff0cc6cbfb')
    feednami.load(url, function (result) {
        if (result.error) {
            console.log(result.error)
        }
        else {
            $('.news-header').text(result.feed.meta.title);
            $('.news-list').html('');
            var entries = result.feed.entries;
            var entryLoop = ((entries.length < 6) ? entries.length : 6);
            for (var i = 0; i < entryLoop; i++) {
                var entry = entries[i];
                $('.news-list').append('<li class="list-group-item"><a target="_blank" href="' + entry.link + "\">" + entry.title + '</a></li>');
            }
        }
    });
}
updateNews();

setInterval(function () {
    updateNews()
}, 30000);//480000