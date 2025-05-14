import express from 'express';
import callbackHandler from './api/callback.js';
import loginHandler from './api/login.js';
import dotenv from 'dotenv';
import chatHandler from './api/chat.js';
import authRoutes from './api/auth.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.post('/api/chat', chatHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});


app.get('/api/callback', callbackHandler);
app.get('/api/login', loginHandler);
