// ** midleware decalation for routes *** //

const router = require('express').Router();


const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');


  // *** Route added*** //
router.get('/animals', (req, res) => {
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

router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.sendStatus(404); // 404 error defined already
    }
  });

  router.post('/animals', (req, res) => {
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
  

  module.exports  = router;



