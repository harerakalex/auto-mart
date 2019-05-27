import express from 'express';
import User from '../../controllers/user';

const router = express.Router();

// create instance for the user class
const user = new User();

router.post('/signup', user.signup);

router.post('/signin', user.login);

export default router;
