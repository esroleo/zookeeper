const fs = require("fs");
const path = require("path");


// *** Function to handle query for a set of animals that match criteria*** //
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

// *** Function to handle query for a single animal return query *** //
function findById(id, animalsArray) {
const result = animalsArray.filter(animal => animal.id === id)[0];
return result;
}

// *** Validate data function *** //

/*
Now, in our POST route's callback before we create the data and add it to the catalog, 
we'll pass our data through this function. In this case, the animal parameter is going 
to be the content from req.body, and we're going to run its properties through a series 
of validation checks. If any of them are false, we will return false and not create the animal data.
*/

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}


// *** Function for POST *** //
function createNewAnimal(body, animalsArray) {
  //console.log(body);
  const animal = body;
  animalsArray.push(animal);
  // our function's main code will go here!
  fs.writeFileSync(
    path.join(__dirname, "../data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
}

// *** Export the functions *** //

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };

  
