function updateNews() {
    feednami.load("http://feeds.nos.nl/nosjournaal", function (result) {
        if (result.error) {
            console.log(result.error)
        }
        else {
            $('.news-header').text(result.feed.meta.title);
            $('.news-list').html('');
            var entries = result.feed.entries;
            var entryLoop = ((entries.length < 5) ? entries.length : 5);
            for (var i = 0; i < entryLoop; i++) {
                var entry = entries[i];
                $('.news-list').append('<li class="list-group-item">' + entry.title + '</li>');
            }
        }
    });
}
updateNews();

setInterval(function () {
    updateNews()
}, 480000)