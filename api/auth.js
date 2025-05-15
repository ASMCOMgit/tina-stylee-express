import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

let accessToken = null;

router.post('/token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token ausente' });

  accessToken = token;
  res.json({ message: 'Token salvo com sucesso' });
});

router.get('/token', (req, res) => {
  if (!accessToken) return res.status(404).json({ error: 'Token não encontrado' });
  res.json({ accessToken });
});

export { accessToken };
export default router;
