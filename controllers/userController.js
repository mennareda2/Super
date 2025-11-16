// controllers/userController.js

const User = require('../models/User'); // استيراد نموذج المستخدم

// 1. عرض نموذج التسجيل (Register Form)
const renderRegisterForm = (req, res) => {
    res.render('users/register', { pageTitle: 'تسجيل مستخدم جديد' });
};

// 2. معالجة منطق التسجيل (Register Logic)
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // إنشاء مستخدم جديد. (middleware pre-save سيقوم بتجزئة كلمة المرور تلقائياً)
        const newUser = new User({ username, email, password }); 
        const user = await newUser.save();

        // تسجيل دخول المستخدم تلقائياً بعد التسجيل الناجح
        // نستخدم req.session لتخزين معرف المستخدم في الجلسة
        req.session.userId = user._id; 
        
        res.redirect('/products'); 
    } catch (e) {
        // التحقق من الأخطاء (مثل اسم مستخدم أو بريد إلكتروني مكرر)
        let errorMessage = 'حدث خطأ أثناء التسجيل.';
        if (e.code === 11000) { // كود الخطأ 11000 يشير إلى تكرار مفتاح فريد (unique)
            errorMessage = 'هذا الاسم أو البريد الإلكتروني مسجل مسبقاً.';
        } else if (e.message.includes('required')) {
            errorMessage = e.message;
        }

        res.render('users/register', { 
            pageTitle: 'خطأ في التسجيل',
            error: errorMessage,
            username: req.body.username,
            email: req.body.email
        });
    }
};

// 3. عرض نموذج تسجيل الدخول (Login Form)
const renderLoginForm = (req, res) => {
    res.render('users/login', { pageTitle: 'تسجيل الدخول' });
};

// 4. معالجة منطق تسجيل الدخول (Login Logic)
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    
    // استخدام الدالة validatePassword التي أنشأناها في نموذج User
    const user = await User.validatePassword(username, password);

    if (user) {
        // إذا كان التحقق ناجحاً
        req.session.userId = user._id; // تسجيل معرف المستخدم في الجلسة
        res.redirect('/products');
    } else {
        // إذا فشل التحقق
        res.render('users/login', { 
            pageTitle: 'خطأ في تسجيل الدخول',
            error: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
            username: username
        });
    }
};

// 5. معالجة الخروج (Logout Logic)
const logoutUser = (req, res) => {
    // تدمير الجلسة (Session)
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/products');
        }
        res.redirect('/');
    });
};


module.exports = {
    renderRegisterForm,
    registerUser,
    renderLoginForm,
    loginUser,
    logoutUser
};