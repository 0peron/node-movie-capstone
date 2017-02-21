$(document).ready(function () {
    $.getJSON("https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet',
            key: 'AIzaSyAb_vpzPd09vDWQAounmUNPVGPj-oLOxQc',
            q: '2017 official trailers',
            type: 'video',
            maxResults: '16'
        },
        function (apiData) {
            console.log(apiData);
            if (apiData.pageInfo.totalResults == 0) {
                addHTML += '<p>No Results</p>';
                $('.js-search-results').html(addHTML);
            } else {
                displaySearch(apiData.items);
            }
            $('.js-search-results').show();
        });


    function displaySearch(videosArray) {
        var addHTML = "";
        $('.wrapper').show();
        $.each(videosArray, function (videoArrayKey, videoArrayValue) {
            addHTML += "<li>";
            addHTML += "<p>" + videoArrayValue.snippet.title + "</p>";
            addHTML += "<a href='https://www.youtube.com/watch?v=" + videoArrayValue.id.videoId + "' target='_blank'>";
            addHTML += "<img src='" + videoArrayValue.snippet.thumbnails.medium.url + "'/>";
            addHTML += "</a>";
            addHTML += "</li>";
        });
        $('.movieTrailers ul').html(addHTML);
    }
});
