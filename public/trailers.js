$(document).ready(function () {
    $('.overlay').hide();
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
            addHTML += "<iframe src='https://www.youtube.com/embed/" + videoArrayValue.id.videoId + "?rel=0&showinfo=0' width='434' height='315' frameborder='0' allowfullscreen></iframe>";
            addHTML += "</li>";
        });
        $('.movieTrailers ul').html(addHTML);
    }
});
