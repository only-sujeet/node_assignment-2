const express = require('express');
const router = express.Router();
const Category = require('../Model/categoryModal');


router.get('/create', (req, res) => {
  res.render('category/create');
});

router.post('/create', async (req, res) => {
  const { name, description } = req.body;
  const category = new Category({ name, description });
  await category.save();
  res.redirect('/category/list');
});

router.get('/list', async (req, res) => {
  const categories = await Category.find();
  res.render('category/list', { categories });
});


router.get('/:id/edit', async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render('category/edit', { category });
});

router.post('/:id/edit', async (req, res) => {
  const { name, description } = req.body;
  await Category.findByIdAndUpdate(req.params.id, { name, description });
  res.redirect('/category/list');
});


router.post('/:id/delete', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/category/list');
});

module.exports = router;
