// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // لاستخدام التجزئة (Hashing)

// تعريف مخطط المستخدم
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'اسم المستخدم مطلوب.'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب.'],
        unique: true
    },
    password: { // سنخزن هنا كلمة المرور المُجزأة
        type: String,
        required: [true, 'كلمة المرور مطلوبة.']
    }
});

// شرح مبسط (Term Explanation):
// Hashing (bcrypt): A one-way cryptographic function that takes an input (password) and returns a fixed-size, seemingly random string (hash). This prevents storing the actual password, increasing security.
// (الترجمة العربية): (التجزئة (bcrypt): هي دالة تشفير ذات اتجاه واحد تأخذ مدخل (كلمة المرور) وتُرجع سلسلة نصية عشوائية المظهر وذات حجم ثابت. هذا يمنع تخزين كلمة المرور الفعلية، مما يزيد من الأمان.)

// 1. Middleware ما قبل الحفظ (Pre-Save Hook): لتجزئة كلمة المرور
// سيتم تنفيذ هذه الدالة قبل كل عملية 'save' (حفظ) للمستخدم الجديد/المعدّل
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // تحقق إن كانت كلمة المرور هي التي تم تعديلها
        return next();
    }
    // تجزئة كلمة المرور
    this.password = await bcrypt.hash(this.password, 12); // 12 هي عدد دورات التجزئة (Salt rounds)
    next();
});

// 2. إضافة دالة للمقارنة: للتحقق من كلمة المرور أثناء تسجيل الدخول
userSchema.statics.validatePassword = async function (username, password) {
    const user = await this.findOne({ username });
    if (!user) {
        return false; // المستخدم غير موجود
    }
    // مقارنة كلمة المرور المدخلة (password) مع الكلمة المُجزأة المحفوظة (user.password)
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : false; // إذا كانت صحيحة، نُرجع كائن المستخدم
};


// 3. إنشاء النموذج
const User = mongoose.model('User', userSchema);
module.exports = User;