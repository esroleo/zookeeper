const fs = require('fs');
const path = require('path');
const express = require('express');
// heroku pages
// https://<your-app>.herokuapp.com/api/animals
// https://boiling-beyond-01215.herokuapp.com/api/animals



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

// *** Use default port of Heroku *** //
const PORT = process.env.PORT || 3001;

// *** Initialize our express application *** //
const app = express();

// Create routes to serve any front-end asset *** //
app.use(express.static('public'));

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());



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
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
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


// E.g We only want one specific animal, 
// rather than an array of all the animals that match a query.

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404); // 404 error defined already
    }
  });


// *** Populate Data *** //

app.post('/api/animals', (req, res) => {
  // req.body is where our incoming content will be
  // lenght vs index.. lenght is +1 hence why the below works
  req.body.id = animals.length.toString();
  //console.log(req.body);

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
  // add animal to json file and animals array in this function
  const animal = createNewAnimal(req.body, animals);
  res.json(animal);
  //res.json(req.body);
  }
});

// server listening function
// Use default heroku port defined above
// https://mighty-waters-18993.herokuapp.com/api/animals
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });


// *** Server send ./public/index.html back to the client *** // 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

/// *** Serve route to the animals.html  *** //
/// *** /animals - intentional to keey page organized and expectation of data *** //
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

/// *** Serve route to the zookeepers.hml
app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});