import express from 'express';
import Order from '../../controllers/order';

const router = express.Router();

// create instance for the order class 
const order = new Order();

// route for specific order
router.get('/:id', order.fetch);

// route for creating order
router.post('/', order.create);

// route for updating the price order
router.patch('/:id/price', order.update);

export default router;