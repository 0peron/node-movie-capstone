 var zipCode = '';

window.onload = movieApiCall(19139);

 function movieApiCall(zipCode) {

     $.ajax({
             url: "/movies/" + zipCode,
             type: 'GET',
             dataType: 'json'
         })
         .done(function(result) {
             //  console.log(result);
             displayQuery(result);
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
             $('.errorMessage').show();
             $('.errorMessage p').text("Opps there was an error handeling your request.")
         });
 }

 function displayQuery(data) {
     console.log(data);
     var addHTML = "";
     addHTML += "<h1 class = zipcode> Movies playing at theaters within 5 miles of " + zipCode + "</h1>";
     $.each(data, function(index, movie) {
         addHTML += "<div class='movieContain'>";
         addHTML += "<form class='addMovieToFavorites'>";
         addHTML += "<input type='hidden' class='addToFavoritesMovieValue' value='" + movie.title + "'>";
         addHTML += "<input type='hidden' class='addToFavoritesLinkValue' value='" + movie.title + "'>";
         addHTML += "<input type='hidden' class='addToFavoritesIdValue' value='" + movie.rootId + "'>";
         addHTML += "<button class='addToFavoritesButton' type='submit'>";
         addHTML += "<p>Add Favorite</p>";
         addHTML += "</button>";
         addHTML += "</form>";
         addHTML += "<div class='movieTitle'>";
         addHTML += "<a id=\"" + movie.title + "\" class='anchor'>.</a>";
         addHTML += "<h1 class=\"" + movie.title + "\"><a href='" + movie.officialUrl + "' target='_blank'>" + movie.title + "</a></h1>";

         $.each(movie.ratings, function(ratingInxed, ratingValue) {
             addHTML += "<p>" + ratingValue.code + '</p>';
         });
         addHTML += "<p class ='genre'>";
         $.each(movie.genres, function(genresInxed, genresValue) {
             addHTML += genresValue + "; ";
         });
         addHTML += "</p>";
         addHTML += "<p>" + movie.shortDescription + "<p>";
         addHTML += "</div>";
         $.each(movie.showtimes, function(showtimeIndex, showtimeValue) {
             addHTML += "<div class='theater'>";
             addHTML += "<button class='accordion'>" + showtimeValue.theatre.name + "</button>";
             addHTML += "<div class='panel'>";

            //   console.log(showtimeValue.ticketURI);

             if ((showtimeValue.ticketURI != '') || (showtimeValue.ticketURI != null) || (showtimeValue.ticketURI != 'undefined') || (typeof showtimeValue.ticketURI != 'undefined')) {
                 addHTML += "<a href='" + showtimeValue.ticketURI + "' target='_blank'>" + showtimeValue.dateTime + "</a>";
                 addHTML += "</div>";
                 addHTML += "</div>";
             }
             else {
                 addHTML += "<a href='http://www.fandango.com/search?q=" + movie.title + "&mode=Movies' target='_blank'>" + showtimeValue.dateTime + "</a>";
                 addHTML += "</div>";
                 addHTML += "</div>";
             }
         });
         addHTML += "</div>";
         addHTML += "</div>";
     });
     $('.movieTitles ul').html(addHTML);
 }

 $(window).click(function() {
     $('.dropdown-content').hide();
 });

 function populateFavoritesContainer() {
     $(document).on('click', '.dropbtn', function(event) {
         event.preventDefault();
         event.stopPropagation();
         $('.dropdown-content').show();
     });
     //console.log(searchTerm)
     $.ajax({
             type: "GET",
             url: "/populate-favorites",
             dataType: 'json',
             contentType: 'application/json'
         })
         .done(function(data) {
             //If successful, set some globals instead of using result object
             console.log(data);


             var addHTML = "";

             $.each(data, function(index, movie) {

                 addHTML += "<li class='dropdown'>";
                 addHTML += "<h2>";
                 addHTML += "<button class='clearFavoritesButton'>";
                 addHTML += "<img src='/images/red-close.png' class='clear-favourite-icon'>";
                 addHTML += '</button>';
                 addHTML += "<a href='#" + movie.link + "'>" + movie.name + "</a>";
                 addHTML += "<input type='hidden' class='deleteIdValue' value='" + movie.idValue + "'>";
                 addHTML += "</h2>";
                 addHTML += "</li>";
             });

             $(".favoritesContainer ul").html(addHTML);
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
             $('.errorMessage').show();
             $('.errorMessage p').text("Opps there was an error handeling your request.")
         });
 }

 $(document).ready(function() {
     $('.overlay').hide();
     $('.wrapper').hide();
     $('.errorMessage').hide();
     $('.wrapper').show();
     zipCode = $('.js-query').val();

     $('.js-search-form').submit(function(event) {
         event.preventDefault;
         zipCode = $('.js-query').val();
         $('.errorMessage').hide();
         console.log("zipCode = ", zipCode);
         movieApiCall(zipCode);
         $('.wrapper').show();
     });
 });

 $(document).on('click', '.addToFavoritesButton', function(event) {
     //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
     event.preventDefault();
     $('.dropdown-content').show();
     //get the value from the input box
     var movieValue = $(this).parent().find('.addToFavoritesMovieValue').val();
     var linkValue = $(this).parent().find('.addToFavoritesLinkValue').val();
     var idValue = $(this).parent().find('.addToFavoritesIdValue').val();
     console.log(movieValue, idValue);


     var nameObject = {
         'name': movieValue,
         'link': linkValue,
         'idValue': idValue
     };

     $.ajax({
             method: 'POST',
             dataType: 'json',
             contentType: 'application/json',
             data: JSON.stringify(nameObject),
             url: '/add-to-favorites/',
         })
         .done(function(result) {
             console.log(result);
             populateFavoritesContainer();
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
             $('.errorMessage').show();
             $('.errorMessage p').text("Opps there was an error handeling your request.")
         });
 });

 $(document).on('click', '.clearFavoritesButton', function(event) {
     //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
     event.preventDefault();
     event.stopPropagation();
     var idValue = $(this).parent().find('.deleteIdValue').val();
     console.log('id value', idValue);

     var movieId = {
         idValue: idValue
     };

     $.ajax({
             method: 'DELETE',
             dataType: 'json',
             contentType: 'application/json',
             data: JSON.stringify(movieId),
             url: '/delete-favorites',
         })
         .done(function(result) {
             console.log(result);
             populateFavoritesContainer();
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
             $('.errorMessage').show();
             $('.errorMessage p').text("Opps there was an error handeling your request.")
         });
 });
 $(document).on('click', '.accordion', function(event) {
    	event.preventDefault();
    	// create accordion variables
    	var accordion = $(this);
    	var panel = accordion.next('.panel');
    	
    	// toggle accordion link open class
    	accordion.toggleClass("open");
    	// toggle accordion content
    	panel.slideToggle(250);
    });