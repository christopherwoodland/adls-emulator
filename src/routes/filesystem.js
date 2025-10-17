const express = require('express');
const router = express.Router();

// DFS (Hadoop) compatible filesystem endpoints
// These are aliases to the blob endpoints but follow HDFS semantics

router.get('/webhdfs/v1/*', (req, res) => {
  res.status(501).json({
    error: 'WebHDFS API not yet implemented',
    note: 'Use the blob API endpoints instead',
  });
});

// Future: Add more filesystem-specific operations here

module.exports = router;
