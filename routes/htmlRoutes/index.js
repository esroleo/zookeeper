const path = require('path');
const router = require('express').Router();

// *** Server send ./public/index.html back to the client *** // 
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
  
  /// *** Serve route to the animals.html  *** //
  /// *** /animals - intentional to keey page organized and expectation of data *** //
  router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  });
  
  /// *** Serve route to the zookeepers.hml
  router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });

module.exports = router;