import express from 'express';
import Car from '../../controllers/car';

const router = express.Router();

// create car instance
const car = new Car();

// creating a product car
router.post('/', car.create);

router.get('/', car.fetch);

router.get('/:id', car.fetchId);

router.patch('/:id/price', car.updatePrice);

router.patch('/:id/status', car.updateStatus);

router.delete('/:id', car.delete);

export default router;
