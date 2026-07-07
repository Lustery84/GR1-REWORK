const router = require('express').Router();
const vnpayCtrl = require('../controllers/vnpay');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/create_payment_url', vnpayCtrl.createPaymentUrl);

module.exports = router;
