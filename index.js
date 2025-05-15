import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import imagemRoute from './api/imagem.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', imagemRoute);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});