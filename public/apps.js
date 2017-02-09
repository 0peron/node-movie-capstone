$(document).ready(function () {
    $('.overlay').hide();
    var zip = $('.js-query').val();
    $('.reg').click(function (event) {
        var addHTML = "";
        var hidemodalClickFunction = '$(".overlay").hide()';
        addHTML += "<div class='modal'>";
        addHTML += "<p>Register</p>"
        addHTML += '<form class="create" id="create">'
        addHTML += '<label for="query"></label>'
        addHTML += '<input type="text" class="js-user" placeholder="Username">'
        addHTML += '<input type="password" class="js-password" placeholder="Password">'
        addHTML += '<input type="text" class="js-zipcode" placeholder="zipcode">'
        addHTML += '<button type="submit" class="logButton" onclick=' + hidemodalClickFunction + '>Submit</button>'
        addHTML += "</form>"
        addHTML += "</div>";
        $('.modal_wrapper').html(addHTML);
        $('.overlay').show();
    });

    $('.modal_wrapper').on('click', function (e) {
        var target = e.target;

        if ($(target).is('.modal_wrapper')) {
            $('.overlay').fadeOut();
        }
    });

    $('.js-search-form').submit(function (event) {
        event.preventDefault;
        var zipCode = $('.js-query').val();
        console.log("zipCode = ", zipCode);
        movieApiCall(zipCode);
    });

    $('#create').submit(function (event) {
        event.preventDefault;
        $('.overlay').fadeOut();
    });

    function movieApiCall(zipCode) {

        $.ajax({
                url: "/movies/" + zipCode,
                type: 'GET',
                dataType: 'json'
            })
            .done(function (result) {
                console.log(result);
                displayQuery(result);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }

    function displayQuery(data) {
        console.log(data);
        var addHTML = "";
        //        addHTML += "<h1 class = zipcode> Movies playing at theaters withing 5 miles of " + zip + "</h1>";
        $.each(data, function (index, movie) {
            addHTML += "<div class =movieContain>"
            addHTML += "<div class='movieTitle'>";
            addHTML += "<h1><a href='" + movie.officialUrl + "'>" + movie.title + "</a></h1>";

            $.each(movie.ratings, function (ratingInxed, ratingValue) {
                addHTML += "<p>" + ratingValue.code + '</p>'
            });
            $.each(movie.genres, function (genresInxed, genresValue) {
                addHTML += "<li class ='genre'>" + genresValue + "</li>"
            });
            addHTML += "<p>" + movie.shortDescription + "<p>";
            addHTML += "</div>";
            $.each(movie.showtimes, function (showtimeIndex, showtimeValue) {
                addHTML += "<div class='theater'>";
                addHTML += "<p>" + showtimeValue.theatre.name + "</p>";
                addHTML += "</div>";

                console.log(showtimeValue.ticketURI);

                if ((showtimeValue.ticketURI != '') || (showtimeValue.ticketURI != null) || (showtimeValue.ticketURI != 'undefined') || (typeof showtimeValue.ticketURI != 'undefined') || (showtimeValue.ticketURI)) {
                    addHTML += "<a href='" + showtimeValue.ticketURI + "'>" + showtimeValue.dateTime + "</a>";
                } else {
                    addHTML += "<a href='http://www.fandango.com/search?q=" + movie.title + "&mode=Movies'>" + showtimeValue.dateTime + "</a>";
                }
            });
            addHTML += "</div>"
        });
        $('.movieTitles ul').html(addHTML);
    }

    function usersApiCall(userName, password, zipCode) {

        $.ajax({
                url: "/users",
                type: 'GET',
                dataType: 'json'
            })
            .done(function (result) {
                console.log(result);
                displayQuery(result);
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    }


})
