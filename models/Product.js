// models/Product.js

const mongoose = require('mongoose');

// شرح مبسط (Term Explanation):
// Schema: The blueprint for documents in a MongoDB collection. It defines fields, types, and validation rules.
// (الترجمة العربية): (المخطط: هو المخطط الهندسي للمستندات في مجموعة MongoDB. يحدد الحقول، وأنواع البيانات، وقواعد التحقق.)

// 1. تعريف مخطط المنتج (Product Schema)
const productSchema = new mongoose.Schema({
    // اسم المنتج (String - مطلوب - فريد)
    name: {
        type: String,
        required: [true, 'اسم المنتج مطلوب.'],
        trim: true, 
        unique: true // يجب أن يكون الاسم فريداً لمنع التكرار
    },
    // سعر المنتج (Number - مطلوب - يجب أن يكون أكبر من الصفر)
    price: {
        type: Number,
        required: [true, 'سعر المنتج مطلوب.'],
        min: [0, 'السعر لا يمكن أن يكون سالباً.']
    },
    // وصف المنتج (String - اختياري)
    description: {
        type: String,
        default: 'لا يوجد وصف متاح.'
    },
    // كمية المنتج المتوفرة في المخزون (Number - مطلوب - قيمة افتراضية 0)
    stockQuantity: {
        type: Number,
        required: [true, 'كمية المخزون مطلوبة.'],
        default: 0
    },
    // تاريخ الإنشاء (يتم تعيينه تلقائياً)
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// 2. إنشاء النموذج (Model)
// هذا سيقوم بإنشاء مجموعة (Collection) في MongoDB تسمى 'products'
const Product = mongoose.model('Product', productSchema);

// 3. تصدير النموذج لاستخدامه في باقي التطبيق
module.exports = Product;