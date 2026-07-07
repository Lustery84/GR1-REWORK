const Bill = require('../models/bill');
const asyncHandler = require('express-async-handler');
const sendMail = require('../utils/sendMail');
const { default: mongoose } = require('mongoose');

//tạo mới đơn hàng
const createNewBill = asyncHandler(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error("Vui lòng nhập đầy đủ thông tin");
    }

    const newBill = new Bill(req.body);
    await newBill.save();

    // Populate product data to display in email
    const populatedBill = await Bill.findById(newBill._id).populate('items.product');

    let itemsHtml = '';
    let totalAmount = 0;

    if (populatedBill && populatedBill.items) {
        populatedBill.items.forEach((item, index) => {
            if (item.product) {
                const product = item.product;
                const salePrice = product.sale > 0 ? (product.price - (product.price * product.sale / 100)) : product.price;
                const lineTotal = salePrice * item.quantity;
                totalAmount += lineTotal;

                itemsHtml += `
                    <tr>
                        <td style="text-align:center;">${index + 1}</td>
                        <td>${product.title}</td>
                        <td style="text-align:center;">${item.quantity}</td>
                        <td style="text-align:right;">${salePrice.toLocaleString()} đ</td>
                        <td style="text-align:right;">${lineTotal.toLocaleString()} đ</td>
                    </tr>
                `;
            }
        });
    }

    //nếu thành công thì gửi mail thông báo
    const html = `
    <style>
        h3 {
            color: blue;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            color: #333;
        }
        strong {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
    </style>

    <h3>Đơn hàng của bạn đã được đặt thành công</h3>
    
    <p>Xin Chào ${newBill.name}</p>
    <p>Chúng tôi đã tiếp nhận và xử lý đơn hàng <strong>${newBill._id} </strong></p>

    <h2>Thông tin khách hàng</h2>
    <p><strong>Tên:</strong> ${newBill.name}</p>
    <p><strong>Email:</strong> ${newBill.email}</p>
    <p><strong>Số điện thoại:</strong> ${newBill.mobile}</p>
    <p><strong>Địa chỉ giao hàng:</strong> ${newBill.shippingAddress}</p>

    <h2>Thông tin đơn hàng</h2>
    <p><strong>Phương thức thanh toán:</strong> ${newBill.paymentMethod}</p>
    <p><strong>Phương thức vận chuyển:</strong> ${newBill.shippingMethod}</p>
    <p><strong>Ghi chú:</strong> ${newBill.note}</p>
    <p><strong>Trạng thái:</strong> ${newBill.status}</p>

    <h2>Chi tiết đơn hàng</h2>
    <table border="1" cellpadding="10" cellspacing="0">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHtml}
            <tr>
                <td colspan="4" style="text-align: right; font-weight: bold;">Tổng cộng:</td>
                <td style="text-align: right; font-weight: bold; color: red;">${totalAmount.toLocaleString()} đ</td>
            </tr>
        </tbody>
    </table>

    <p style="margin-top:20px;">Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi</p>
`;


    const subject = 'Đặt hàng thành công';
    const data = {
        email: newBill.email,
        html,
        subject
    }

    try {
        await sendMail(data);
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
    }

    res.status(201).json({ success: true, data: newBill });
})

const getAllBill = asyncHandler(async (req, res) => {
    const bills = await Bill.find()
        .populate('items.product')
        .populate('user');
    res.status(200).json({ success: true, data: bills });
});


//chi tiết đơn hàng
const getBill = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id)
        .populate('items.product')
        .populate('user');

    if (!bill) {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng này');
    }

    res.status(200).json({ success: true, data: bill });
});

const getBillByUser = asyncHandler(async (req, res) => {
    const bills = await Bill.find({ user: req.user._id })
        .populate('items.product')
        .populate('user');

    if (!bills) {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng này');
    }

    res.status(200).json({ success: true, data: bills });
});


//cập nhật trạng thái đơn hàng
const updateStatusBill = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng này');
    }

    bill.status = req.body.status;
    if (req.body.status === 'Đã Hủy' && req.body.cancelReason) {
        bill.cancelReason = req.body.cancelReason;
    }
    await bill.save();

    res.status(200).json({ success: true, data: bill });
});

//khách hàng tự hủy đơn hàng
const cancelBillUser = asyncHandler(async (req, res) => {
    const bill = await Bill.findOne({ _id: req.params.id, user: req.user._id });

    if (!bill) {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng này');
    }

    if (bill.status !== 'Chờ Xác Nhận') {
        res.status(400);
        throw new Error('Chỉ có thể hủy đơn hàng đang chờ xác nhận');
    }

    bill.status = 'Đã Hủy';
    bill.cancelReason = req.body.cancelReason || 'Người dùng tự hủy';
    await bill.save();

    res.status(200).json({ success: true, data: bill });
});

//cập nhật thông tin đơn hàng
const updateBill = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        res.status(404);
        throw new Error('Không tìm thấy đơn hàng này');
    }

    bill.name = req.body.name || bill.name;
    bill.email = req.body.email || bill.email;
    bill.mobile = req.body.mobile || bill.mobile;
    bill.shippingAddress = req.body.shippingAddress || bill.shippingAddress;
    bill.paymentMethod = req.body.paymentMethod || bill.paymentMethod;
    bill.shippingMethod = req.body.shippingMethod || bill.shippingMethod;
    bill.note = req.body.note || bill.note;
    bill.status = req.body.status || bill.status;

    await bill.save();

    res.status(200).json({ success: true, data: bill });
});

module.exports = {
    createNewBill,
    getAllBill,
    getBill,
    updateBill,
    getBillByUser,
    updateStatusBill,
    cancelBillUser
}