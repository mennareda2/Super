// routes/products.js (محدث لترتيب المسارات)

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); 
const { isLoggedIn } = require('../middleware'); 

// 1. المسارات التي يجب أن تأتي أولاً (الثابتة):

// مسار عرض نموذج الإضافة: يجب أن يأتي قبل مسار :id
router.get('/new', isLoggedIn, productController.renderNewForm); 

// المسارات التي لا تستخدم ID في الأساس:
router.route('/')
    .get(productController.index)         
    .post(isLoggedIn, productController.createProduct); 


// 2. المسارات التي تستخدم ID (الديناميكية) وتأتي في النهاية:
router.get('/:id/edit', isLoggedIn, productController.renderEditForm); 

router.route('/:id')
    .get(productController.showProduct)   
    .put(isLoggedIn, productController.updateProduct) 
    .delete(isLoggedIn, productController.deleteProduct);


// تصدير الـ Router
module.exports = router;