// middleware/index.js

// شرح مبسط (Term Explanation):
// Authorization: The process of verifying what a user is permitted to do or access, after they have successfully authenticated (logged in).
// (الترجمة العربية): (التفويض: عملية التحقق مما يُسمح للمستخدم بفعله أو الوصول إليه، بعد أن قام بتوثيق هويته بنجاح (سجل الدخول).)

// دالة Middleware للتأكد من أن المستخدم قام بتسجيل الدخول
module.exports.isLoggedIn = (req, res, next) => {
    // التحقق من وجود userId في الجلسة (Session)
    if (!req.session.userId) {
        // إذا لم يكن مسجلاً، نقوم بإعادة توجيهه إلى صفحة الدخول
        // ونخزن المسار الذي كان يحاول الوصول إليه ليسهل عليه العودة بعد الدخول (اختياري لكنه مفيد)
        req.session.returnTo = req.originalUrl;
        
        // يمكننا استخدام رسالة فلاش (Flash Message) هنا، لكننا سنكتفي بالرابط الآن.
        
        // إعادة التوجيه إلى صفحة تسجيل الدخول
        return res.redirect('/login');
    }
    // إذا كان مسجلاً، ننتقل إلى دالة التحكم (Controller) التالية
    next();
};