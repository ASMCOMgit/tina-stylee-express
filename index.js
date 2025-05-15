import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';

import testeTinyRoute from './routes/teste-tiny-express.js';
import callbackHandler from './api/callback.js';
import loginHandler from './api/login.js';
import chatHandler from './api/chat.js';
import authRoutes from './api/auth.js';
import imagemRouter from './api/imagem.js';

dotenv.config();
const app = express();

// ⚠️ Deixe o express.json() depois da imagem para evitar conflitos
app.use('/api/teste-tiny', testeTinyRoute);
app.use('/api/auth', authRoutes);
app.post('/api/chat', chatHandler);
app.use('/api', imagemRouter); // <- deve vir antes de app.use(express.json())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/callback', callbackHandler);
app.get('/api/login', loginHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
