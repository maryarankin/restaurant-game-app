//const mongoose = require('mongoose')

// //right number of slashes?
// const Dish = require('../models/dish')

// // const priceButton = document.querySelector('#price')

// // priceButton.addEventListener('click', async () => {
// //     const dish = await Dish.findOne({ name: 'cheesePizza' })
// //     console.log(dish)
// //     //dish.price += 1
// //     //await dish.save()
// // })

//follow tutorial at https://gist.github.com/aerrity/fd393e5511106420fba0c9602cc05d35 if want to add this
//functionality; for now, will just use forms to do this

//this is the relevant code from the github link:
// const button = document.getElementById('myButton');
// button.addEventListener('click', function(e) {
//   console.log('button was clicked');

//   fetch('/clicked', {method: 'POST'})
//     .then(function(response) {
//       if(response.ok) {
//         console.log('Click was recorded');
//         return;
//       }
//       throw new Error('Request failed.');
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// });

// then in main file:
// // add a document to the DB collection recording the click event
// app.post('/clicked', (req, res) => {
//     const click = {clickTime: new Date()};
//     console.log(click);
//     console.log(db);

//     db.collection('clicks').save(click, (err, result) => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log('click added to db');
//       res.sendStatus(201);
//     });
//   });


