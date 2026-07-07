I. GIOI THIEU
- Du an HUST Shop la mot du an thuong mai dien tu.
- Du an gom 3 module chinh: Server, Admin, va User.

II. TOOL VA VERSION
- Node.js (moi nhat hoac tuong thich voi Express 4.x)
- ExpressJS: ^4.19.2
- Mongoose: ^8.2.3
- AngularJS
- Bootstrap 5

III. MO TA MODULE
- Server: Ung dung API viet bang Node.js, ExpressJS va MongoDB. Cung cap cac API cho Admin va User.
- Admin: Ung dung web quan tri, cho phep quan ly san pham, don hang va nguoi dung.
- User: Ung dung web thuong mai dien tu danh cho khach hang, cho phep mua sam.

IV. CACH CAI DAT
- 1. Cai dat Node.js tren may tinh cua ban.
- 2. Clone repository nay vao may tinh.
- 3. Cai dat thu muc Server:
  - Mo thu muc Server tren terminal.
  - Chay lenh "npm install" de cai dat cac thu vien phu thuoc.
- 4. Cau hinh bien moi truong:
  - Doi ten tep .env.example thanh .env.
  - Dien cac thong so can thiet: PORT, MONGO_URL, SECRET_KEY, MAIL_NAME, MAIL_PASSWORD, URL, cac key cua CLOUDINARY.
- 5. Chay thu nghiem:
  - Chay lenh "npm run createAdmin" de tao tai khoan quan tri.
  - Chay lenh "npm run dev" de khoi dong Server.
  - De chay Admin va User, su dung plugin Live Server tren VSCode va mo file index.html tuong ung.
