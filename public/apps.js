 var zipCode = '';


 function movieApiCall(zipCode) {

     $.ajax({
             url: "/movies/" + zipCode,
             type: 'GET',
             dataType: 'json'
         })
         .done(function(result) {
             console.log(result);
             displayQuery(result);
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
         });
 }

 function displayQuery(data) {
     console.log(data);
     var addHTML = "";
     addHTML += "<h1 class = zipcode> Movies playing at theaters within 5 miles of " + zipCode + "</h1>";
     $.each(data, function(index, movie) {
         addHTML += "<div class =movieContain>";
         addHTML += "<form class='addMovieToFavorites'>";
         addHTML += "<input type='hidden' class='addToFavoritesMovieValue' value='" + movie.title + "'>";
         addHTML += "<button class='addToFavoritesButton' type='submit'>";
         addHTML += "<img src='/images/favorites-icon.png' class='add-favourite-icon' />";
         addHTML += "</button>";
         addHTML += "</form>";
         addHTML += "<div class='movieTitle'>";
         addHTML += "<h1><a href='" + movie.officialUrl + "' target='_blank'>" + movie.title + "</a></h1>";

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
             addHTML += "<p>" + showtimeValue.theatre.name + "</p>";
             addHTML += "</div>";
             addHTML += "</div>";

             console.log(showtimeValue.ticketURI);

             if ((showtimeValue.ticketURI != '') || (showtimeValue.ticketURI != null) || (showtimeValue.ticketURI != 'undefined') || (typeof showtimeValue.ticketURI != 'undefined') || (showtimeValue.ticketURI)) {
                 addHTML += "<a href='" + showtimeValue.ticketURI + "' target='_blank'>" + showtimeValue.dateTime + "</a>";
             }
             else {
                 addHTML += "<a href='http://www.fandango.com/search?q=" + movie.title + "&mode=Movies' target='_blank'>" + showtimeValue.dateTime + "</a>";
             }
         });
         addHTML += "</div>";
     });
     $('.movieTitles ul').html(addHTML);
 }

 function populateFavoritesContainer() {

     //console.log(searchTerm);

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

                 addHTML += "<li>";
                 addHTML += "<div class='favoritesContainerColum'>";
                 addHTML += "</div>";
                 addHTML += "<div class='favoritesContainerColum'>";
                 addHTML += "<p>" + movie.name + "</p>";
                 addHTML += "</div>";
                 addHTML += "</li>";
             });

             $(".favoritesContainer ul").html(addHTML);
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
         });
 }




 function usersApiCall(userName, password, zipCode) {
     var params = {
         'userName': userName,
         'password': password,
         'zipCode': zipCode,
     };
     $.ajax({
             url: "/users",
             type: 'POST',
             data: params,
             dataType: 'json'
         })
         .done(function(result) {
             console.log(result);
             displayQuery(result);
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
         });
 }

 function login(userName, password) {
     var params = {
         'userName': userName,
         'password': password,
         'zipCode': zipCode,
     };

     $.ajax({
             url: "/login",
             type: 'POST',
             data: params,
             dataType: 'json'
         })
         .done(function(result) {
             console.log(result);
             displayQuery(result);
         })
         .fail(function(jqXHR, error, errorThrown) {
             console.log(jqXHR);
             console.log(error);
             console.log(errorThrown);
         });
 }

 $(document).ready(function() {
     $('.overlay').hide();
     $('.wrapper').hide();
     zipCode = $('.js-query').val();
     $('.reg').click(function(event) {
         var addHTML = "";
         var hidemodalClickFunction = '$(".overlay").hide()';
         addHTML += "<div class='modal'>";
         addHTML += "<p>Register</p>";
         addHTML += '<form class="create" id="create">';
         addHTML += '<label for="query"></label>';
         addHTML += '<input type="text" class="js-userReg" placeholder="Username">';
         addHTML += '<input type="password" class="js-passwordReg" placeholder="Password">';
         addHTML += '<input type="text" class="js-zipcodeReg" placeholder="zipcode">';
         addHTML += '<button type="submit" class="logButton" onclick=' + hidemodalClickFunction + '>Submit</button>';
         addHTML += "</form>";
         addHTML += "</div>";
         $('.modal_wrapper').html(addHTML);
         $('.overlay').show();
     });

     $('.modal_wrapper').on('click', function(e) {
         var target = e.target;

         if ($(target).is('.modal_wrapper')) {
             $('.overlay').fadeOut();
         }
     });

     $('.js-search-form').submit(function(event) {
         event.preventDefault;
         zipCode = $('.js-query').val();
         console.log("zipCode = ", zipCode);
         movieApiCall(zipCode);
         $('.wrapper').show();
     });

     $('#create').submit(function(event) {
         event.preventDefault;
         $('.overlay').fadeOut();
     });
 });

 $(document).on("submit", "#create", function(event) {
     event.preventDefault();
     var userName = $(".js-userReg").val();
     var passwords = $(".js-passwordReg").val();
     zipCode = $(".js-zipcodeReg").val();
     console.log(userName, passwords, zipCode);
     usersApiCall(userName, passwords, zipCode);
     movieApiCall(zipCode);
 });

 $(document).on('submit', "#log", function(event) {
     event.preventDefault();
     var userName = $('.js-user').val();
     var password = $(".js-password").val();
     // console.log(userName, password);
     login(userName, password);
 });

 $(document).on('click', '.addToFavoritesButton', function(event) {
     //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
     event.preventDefault();
     //get the value from the input box
     var movieValue = $(this).parent().find('.addToFavoritesMovieValue').val();
     console.log(movieValue)


     var nameObject = {
         'name': movieValue
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
         });
 });

 $(document).on('click', '.clearFavoritesButton', function(event) {
     //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
     event.preventDefault();

     $.ajax({
             method: 'DELETE',
             dataType: 'json',
             contentType: 'application/json',
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
         });
 });