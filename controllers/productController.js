// controllers/productController.js

const Product = require('../models/Product'); 

// 1. عرض قائمة بجميع المنتجات (READ - All)
const index = async (req, res) => {
    try {
        const products = await Product.find({}); 
        res.render('products/index', { products: products, pageTitle: 'قائمة المنتجات' });
    } catch (e) {
        res.status(500).send(`حدث خطأ أثناء جلب المنتجات: ${e.message}`);
    }
};

// 2. عرض نموذج إنشاء منتج جديد (CREATE - Form)
const renderNewForm = (req, res) => {
    res.render('products/new', { pageTitle: 'إضافة منتج جديد' });
};

// 3. معالجة طلب إنشاء منتج جديد (CREATE - Logic)
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body.product); 
        await newProduct.save(); 
        res.redirect(`/products/${newProduct._id}`); 
    } catch (e) {
        // إذا فشل التحقق، نرسل الخطأ والبيانات مرة أخرى لملء النموذج
        res.render('products/new', { 
            error: e.message, 
            product: req.body.product,
            pageTitle: 'خطأ في إضافة منتج'
        });
    }
};

// 4. عرض تفاصيل منتج واحد (READ - Single)
const showProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('عذراً، المنتج غير موجود.');
        }
        res.render('products/show', { product: product, pageTitle: product.name });
    } catch (e) {
        res.status(500).send(`حدث خطأ أثناء جلب المنتج: ${e.message}`);
    }
};

// 5. عرض نموذج تعديل منتج موجود (UPDATE - Form)
const renderEditForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('عذراً، المنتج غير موجود لكي يتم تعديله.');
        }
        res.render('products/edit', { product: product, pageTitle: `تعديل: ${product.name}` });
    } catch (e) {
        res.status(500).send(`حدث خطأ أثناء جلب بيانات التعديل: ${e.message}`);
    }
};

// 6. معالجة طلب تحديث المنتج (UPDATE - Logic)
const updateProduct = async (req, res) => {
    const { id } = req.params; 
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body.product, { runValidators: true, new: true });

        if (!updatedProduct) {
            return res.status(404).send('عذراً، لم يتم العثور على المنتج لتحديثه.');
        }
        res.redirect(`/products/${updatedProduct._id}`);
    } catch (e) {
        const product = await Product.findById(id); 
        res.render('products/edit', { 
            error: e.message, 
            product: product, 
            pageTitle: 'خطأ في التحديث'
        });
    }
};

// 7. حذف المنتج (DELETE)
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).send('عذراً، لم يتم العثور على المنتج لحذفه.');
        }
        res.redirect('/products');
    } catch (e) {
        res.status(500).send(`حدث خطأ أثناء الحذف: ${e.message}`);
    }
};

// تصدير جميع الوظائف (الطريقة الصحيحة لتجنب TypeError)
module.exports = {
    index,
    renderNewForm,
    createProduct,
    showProduct,
    renderEditForm,
    updateProduct,
    deleteProduct
};