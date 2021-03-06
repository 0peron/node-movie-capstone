#FlicFinder
 
 js.node app for the node capstone. This app is working with the OnConnect Data Delivery API from gracenote.
 
 ![screenshot](https://0peron.github.io/node-movie-capstone/public/images/index.png)
 
##Background
 
 I created this app because I love going to the movies and i wanted to see if i could create a simple app that could show me what movies were playing in my area at local theaters.
 
##Use Case
 
 This app is useful because it quickly finds all movie titles playing in the desired zip code as well as their showtimes at theaters around the entered zipcode. It also displays trailers and links to more information about the movie and
 links to how to buy tickets online.
 
##Working Prototype
 
 you can access a working prototype of the app here: https://gentle-lowlands-20810.herokuapp.com/
 
##Functionality
 
The app's functionality includes:

-Trailers to upcoming movies to help decide what movie you would want to see.
![screenshot](https://0peron.github.io/node-movie-capstone/public/images/index.png)
-searching for movies and theaters in your desired zipcode.
![screenshot](https://0peron.github.io/node-movie-capstone/public/images/search.png)
-shows all showtimes for each movie and theater that it is showing.
-links to movie websites
-links to fandango ticket services for desired show times.
-allows you to add movies to favorites for reference on what movies are interested to you.
![screenshot](https://0peron.github.io/node-movie-capstone/public/images/favorites.png)

##Technical

the app is built using html, css, and js.node. it makes use of AJAX and the CRUD system to get information from the gracenote api and returns all relevant data. Favorites data is held on the database until it is cleared by the user.

##Development Roadmap

This is version 1.0 of the app. I expect to add features such as:

-adding a user login that can store users inputed zipcode so they dont have to type it in every time.
-i would also like to add more information about each movie so it could be easily accessable to the user at a glance.
-adding a location service could help to beable to find movies in the area of where the user is currently located. 