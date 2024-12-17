const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const readCarts = () => {
    const data = fs.readFileSync(path.join(__dirname, '../data/carts.json'), 'utf-8');
    return JSON.parse(data);
}

const saveCarts = (carts) => {
    fs.writeFileSync(path.join(__dirname, '../data/carts.json'), JSON.stringify(carts, null, 2));
}

router.post('/', (req, res) => {
    const carts = readCarts();

    const newCart = {
        id: String(carts.length + 1),
        products: []
    };

    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});


router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);

    if (cart) {
        const productId = req.params.pid;
        const quantity = 1;

        const existingProductIndex = cart.products.findIndex(p => p.product === productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        saveCarts(carts);
        res.status(200).json(cart.products);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

module.exports = router;
