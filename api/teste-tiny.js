// api/teste-tiny.js
import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', async (req, res) => {
  try {
    const { endpoint, method, payload } = req.body;

    const tokenPath = path.join(__dirname, '..', 'utils', 'token.json');
    const tokenData = JSON.parse(readFileSync(tokenPath, 'utf-8'));
    const accessToken = tokenData?.access_token;

    if (!accessToken) {
      return res.status(401).json({ erro: 'Token de acesso não encontrado' });
    }

    const tinyUrl = `https://api.tiny.com.br/public-api/v3/${endpoint}`;
    const tinyResponse = await fetch(tinyUrl, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: method === 'POST' ? JSON.stringify(payload) : undefined
    });

    const result = await tinyResponse.json().catch(() => ({
      erro: 'Resposta não está em formato JSON',
      status: tinyResponse.status
    }));

    res.status(tinyResponse.status).json({
      url: tinyUrl,
      resultado: result
    });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao chamar a API do Tiny', detalhes: error.message });
  }
});

export default router;
