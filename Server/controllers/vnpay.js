const crypto = require('crypto');
const querystring = require('querystring');
const asyncHandler = require('express-async-handler');

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

exports.createPaymentUrl = asyncHandler(async (req, res, next) => {
    let ipAddr = "127.0.0.1"; // Hardcode to prevent any weird IP formats from local testing

    let tmnCode = "CGXZLS0Z"; 
    let secretKey = "XNBCJFAKAZQSGTARRLGCHVZWCIOIGSHN";
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let returnUrl = "http://127.0.0.1:5501/"; // Remove #! to avoid Invalid data format error

    let date = new Date();
    // Convert to GMT+7
    let utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    let gmt7 = new Date(utc + (3600000 * 7));

    function pad2(n) { return ('0' + n).slice(-2); }

    let createDate = gmt7.getFullYear() +
        pad2(gmt7.getMonth() + 1) +
        pad2(gmt7.getDate()) +
        pad2(gmt7.getHours()) +
        pad2(gmt7.getMinutes()) +
        pad2(gmt7.getSeconds());

    let gmt7Expire = new Date(utc + (3600000 * 7) + (15 * 60000));
    let expireDate = gmt7Expire.getFullYear() +
        pad2(gmt7Expire.getMonth() + 1) +
        pad2(gmt7Expire.getDate()) +
        pad2(gmt7Expire.getHours()) +
        pad2(gmt7Expire.getMinutes()) +
        pad2(gmt7Expire.getSeconds());

    let orderId = req.body.billId || createDate;
    let amount = parseInt(req.body.amount, 10);
    if (!amount || isNaN(amount)) {
        amount = 10000; // Fallback to 10k to prevent NaN crashing the VNPay format
    }

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
    vnp_Params['vnp_OrderType'] = 'billpayment';
    vnp_Params['vnp_Amount'] = Math.round(amount * 100);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expireDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = Object.keys(vnp_Params)
        .map(key => key + '=' + vnp_Params[key])
        .join('&');
        
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    
    let queryString = Object.keys(vnp_Params)
        .map(key => key + '=' + vnp_Params[key])
        .join('&');
        
    vnpUrl += '?' + queryString;

    res.status(200).json({success: true, data: vnpUrl})
});
