#This Project helps you view and book different tours in different parts of the Country, There are variety of tours one can choose from.

It is built using Node.js, express.js, MongoDB on the backend and Front-end is built using pug templating engine.
JWT mechanism is used for user autentication, Users login and signup using the generated token. All the data is
fetched in real time from the MongoDB database using mongoose library.Every Individual tour contains location checkpoints on the map.
The map functionality is implemented using Leaflet Javascript Library.User can also add reviews for any particular tour.
At the end, A User can book the Tour that he/she likes using the Integrated stripe API.
