// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './api/auth.js';
import chatHandler from './api/chat.js';
import imagemRouter from './api/imagem.js';
import testeTinyRoute from './api/teste-tiny.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // deve vir antes das rotas que usam req.body

// Rotas
app.use('/api/teste-tiny', testeTinyRoute); // JSON
app.use('/api/auth', authRoutes);           // JSON
app.post('/api/chat', chatHandler);         // JSON
app.use('/api', imagemRouter);              // multipart/form-data

// Início do servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
