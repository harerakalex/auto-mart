import express from 'express';

// import car, order and user routes
import user from './user/authentication';
import car from './cars/cars';
import order from './order/orders';

// initialize the app to express framework
const app = express();

app.use('/auth', user);
app.use('/car', car);
app.use('/order', order);

// export the routes

export default app;
