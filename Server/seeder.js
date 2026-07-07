const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product');
const Category = require('./models/category');
const slugify = require('slugify');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('Fetching products from Fake Store API...');
        
        let fakeProducts;
        try {
            // Dùng dynamic import cho node-fetch nếu fetch native không tồn tại
            if (typeof fetch === "undefined") {
                const fetchObj = await import('node-fetch');
                fetch = fetchObj.default;
            }
            const res = await fetch('https://fakestoreapi.com/products');
            fakeProducts = await res.json();
        } catch(e) {
            console.error('Error fetching API, falling back to empty list', e);
            fakeProducts = [];
        }

        if (fakeProducts.length === 0) {
            console.log('No data found from API');
            process.exit(1);
        }

        console.log('Clearing old categories and products...');
        await Category.deleteMany();
        await Product.deleteMany();

        console.log('Inserting mapped categories...');
        const categoriesMap = {
            "men's clothing": 'Thời Trang Nam',
            "women's clothing": 'Thời Trang Nữ',
            "jewelery": 'Phụ Kiện Trang Sức',
            "electronics": 'Đồ Điện Tử'
        };

        const insertedCats = {};
        for (const [key, value] of Object.entries(categoriesMap)) {
            const cat = await Category.create({ title: value });
            insertedCats[key] = cat._id;
        }

        console.log('Processing products...');
        const productsData = [];
        
        for (const fp of fakeProducts) {
            const isFlashSale = Math.random() > 0.7; 
            
            // Giả lập giá USD sang VNĐ (ví dụ 109.95 USD -> ~ 2.500.000 VNĐ)
            const priceVND = Math.round(fp.price * 25000 / 1000) * 1000; 

            productsData.push({
                title: fp.title,
                // Slug cần random một chút để không bị trùng lặp
                slug: slugify(fp.title, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 10000),
                description: fp.description,
                price: priceVND,
                sale: isFlashSale ? Math.floor(Math.random() * 3 + 1) * 10 : 0, 
                category: insertedCats[fp.category],
                numberView: Math.floor(Math.random() * 100),
                images: [fp.image, fp.image], // Thêm 2 ảnh giống nhau cho đúng cấu trúc UI (nếu UI cần mảng)
                variants: [
                    { size: 'M', color: 'Đen', quantity: Math.floor(Math.random() * 50 + 10) },
                    { size: 'L', color: 'Trắng', quantity: Math.floor(Math.random() * 50 + 10) }
                ],
                isFlashSale: isFlashSale,
                totalRating: Math.round(fp.rating.rate)
            });
        }

        console.log('Inserting products into Database...');
        await Product.insertMany(productsData);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with import data:', error);
        process.exit(1);
    }
};

seedData();
