const { Router } = require('express');
const { topTargetedAssets } = require('../controllers/dashboardController');

const router = Router();

router.get('/top-targeted', topTargetedAssets);

module.exports = router;
