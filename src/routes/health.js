const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Azure Data Lake Storage Gen2 Emulator',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
