const express = require('express');



// ***  Create a route that the front-end can request data from *** //
const { animals } = require('./data/animals');


// *** main site --> http://localhost:3001/api/animals 
// *** query sample -->  http://localhost:3001/api/animals?name=Erica
// Example ?a=111&b=222&c=333 will become:
/*
{
    a: "111",
    b: "222",
    c: "333"
  }
*/
// Example ?a=111&b=222&b=333 will become  as property b was used more than once.
/*
{
    a: "111",
    b: ["222",  "333"]
}
*/

const app = express();

// *** Function to handle query *** //
function filterByQuery(query, animalsArray) {
    // Personality test 
    //http://localhost:3001/api/animals?name=Erica&personalityTraits=quirky&personalityTraits=rash
    //http://localhost:3001/api/animals?personalityTraits=hungry&name=Marcy
    let personalityTraitsArray = []; // array for personality traits to be return similarily back as array
     // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        //However, if we were to query by only one personality trait, 
        //like personalityTraits=rash, then req.query.personalityTraits 
        //would be the string rash.
        if (typeof query.personalityTraits === 'string') {
          personalityTraitsArray = [query.personalityTraits];
        } else {
          personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
          // Check the trait against each animal in the filteredResults array.
          // Remember, it is initially a copy of the animalsArray,
          // but here we're updating it for each trait in the .forEach() loop.
          // For each trait being targeted by the filter, the filteredResults
          // array will then contain only the entries that contain the trait,
          // so at the end we'll have an array of animals that have every one 
          // of the traits when the .forEach() loop is finished.
          filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
          );
        });
      }

    // if req.query finds any value of .diet then createa  a variable 
    // that will hold an object that will be converted to json when returned.
    // if true, filter the animal object array and deconstruct the animal.diet.
    // if the value of the property animal.diet === to the input of the client the return.
    // filter will loop through the whole object, same as map.
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
  }


// *** Route added*** //
app.get('/api/animals', (req, res) => {
    //res.send('Hello!');
    let results = animals; //store all json data from our our animals.json
    // console.log(req.query)
    // res.json(results);
    //res.json(animals);
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
      res.json(results);
  });

  

// server listening function

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });

