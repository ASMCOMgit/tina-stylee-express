import express from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { endpoint, method = 'GET', payload = null } = req.body;

    if (!endpoint) {
      return res.status(400).json({ erro: 'Parâmetro "endpoint" é obrigatório.' });
    }

    const tokenPath = path.resolve('utils/token.json');
    if (!fs.existsSync(tokenPath)) {
      return res.status(401).json({ erro: 'Token não encontrado. Faça login primeiro.' });
    }

    const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    const accessToken = tokenData?.access_token;

    if (!accessToken) {
      return res.status(403).json({ erro: 'Token de acesso inválido ou ausente.' });
    }

    const url = `https://api.tiny.com.br/public-api/v3/${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: method !== 'GET' ? JSON.stringify(payload) : undefined
    });

    const data = await response.json().catch(() => ({
      erro: 'Resposta não está em JSON válido',
      status: response.status
    }));

    return res.status(response.status).json({ url, resultado: data });

  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao acessar a API Tiny', detalhes: error.message });
  }
});

export default router;