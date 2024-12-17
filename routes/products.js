const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


const readProducts = () => {
    const data = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf-8');
    return JSON.parse(data);
}


const saveProducts = (products) => {
    fs.writeFileSync(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2));
}


router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});


router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const products = readProducts();

    const newProduct = {
        id: String(products.length + 1), 
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);

    if (productIndex !== -1) {
        const updatedProduct = {
            ...products[productIndex],
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: thumbnails || products[productIndex].thumbnails
        };

        products[productIndex] = updatedProduct;
        saveProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const newProducts = products.filter(p => p.id !== req.params.pid);

    if (products.length === newProducts.length) {
        res.status(404).json({ message: 'Producto no encontrado' });
    } else {
        saveProducts(newProducts);
        res.status(200).json({ message: 'Producto eliminado' });
    }
});

module.exports = router;
