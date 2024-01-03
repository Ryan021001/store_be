import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import checkToken from './authentication/auth.js';
import connect from './database/database.js';

import {
  addressesRouter,
  cartsRouter,
  categoryRouter,
  colorsRouter,
  favoritesRouter,
  ordersRouter,
  productsRouter,
  usersRouter,
} from './routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

// Apply CORS middleware early in the middleware chain
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['PUT', 'GET', 'HEAD', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
};

app.use(cors(corsOptions));

// Other middleware
app.use(checkToken);
app.use(express.json());

app.options('/products', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS, PATCH');
  res.status(200).end();
});

// Routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/favorites', favoritesRouter);
app.use('/orders', ordersRouter);
app.use('/addresses', addressesRouter);
app.use('/categories', categoryRouter);
app.use('/colors', colorsRouter);

// Default route
app.get('/', (req, res) => {
  res.send('response from root router');
});

app.listen(port, async () => {
  await connect();
  console.log(`listening on port: ${port}`);
});
