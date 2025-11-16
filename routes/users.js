// routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 

// مسار التسجيل (عرض النموذج وإرسال البيانات)
router.route('/register')
    .get(userController.renderRegisterForm)
    .post(userController.registerUser);

// مسار تسجيل الدخول (عرض النموذج وإرسال البيانات)
router.route('/login')
    .get(userController.renderLoginForm)
    .post(userController.loginUser);

// مسار الخروج (Logout)
router.post('/logout', userController.logoutUser);

module.exports = router;