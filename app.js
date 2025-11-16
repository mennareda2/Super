// app.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

// 1. إنشاء تطبيق Express (التصحيح: هذا هو السطر المفقود الذي حل مشكلة 'app is not defined')
const app = express(); 

const PORT = process.env.PORT || 3000; 

// استيراد ملفات المسارات
const productRoutes = require('./routes/products'); 
const userRoutes = require('./routes/users'); 


// 2. إعداد متجر الجلسة (Session Store)
const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
    secret: process.env.SESSION_SECRET
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR:', e);
});

// 3. إعداد خيارات الجلسة
const sessionConfig = {
    store,
    name: 'session-id', 
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// 4. الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 5. إعداد EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6. Middleware الأساسية
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig)); 

// 7. Middleware لتمرير متغيرات الجلسة إلى الـ Views (res.locals)
app.use((req, res, next) => {
    // تمرير userId (إذا كان موجوداً) ليكون متاحاً لجميع ملفات EJS (navbar)
    res.locals.userId = req.session.userId; 
    next();
});


// 8. تعريف المسارات الرئيسية
app.use('/products', productRoutes); 
app.use('/', userRoutes); 

app.get('/', (req, res) => {
    res.render('home', { pageTitle: 'الصفحة الرئيسية لسوبر ماركت Express' });
});

// 9. تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
});