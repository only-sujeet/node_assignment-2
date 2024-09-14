const express = require('express');
const router = express.Router();
const Product = require('../Model/productModal');
const Category = require('../Model/categoryModal');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/create', async (req, res) => {
    const categories = await Category.find();
    res.render('product/create', { categories });
});

router.post('/create', upload.array('images', 5), async (req, res) => {
    const { name, description, category, price } = req.body;
    const images = req.files.map(file => file.path);
    const product = new Product({ name, description, category, price, images });
    await product.save();
    res.redirect('/product/list');
});


router.get('/list', async (req, res) => {
    const products = await Product.find().populate('category');
    res.render('product/list', { products });
});


router.get('/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    const categories = await Category.find();
    res.render('product/edit', { product, categories });
});

router.post('/:id/edit', upload.array('images', 5), async (req, res) => {
    const { name, description, category, price } = req.body;
    const images = req.files.map(file => file.path);
    await Product.findByIdAndUpdate(req.params.id, { name, description, category, price, images });
    res.redirect('/product/list');
});


router.post('/:id/delete', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/product/list');
});

module.exports = router;
