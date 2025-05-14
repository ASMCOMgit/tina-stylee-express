import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export default async function handler(req, res) {
  const tokenPath = path.resolve('utils/token.json');

  if (!fs.existsSync(tokenPath)) {
    return res.status(401).json({ erro: 'Token não encontrado. Faça login em /api/login' });
  }

  const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  const accessToken = tokenData.access_token;

  const endpoint = req.method === 'GET' ? req.query.endpoint : req.body.endpoint;
  const method = req.body.method || 'GET';
  const payload = req.body.payload || null;

  if (!endpoint) {
    return res.status(400).json({ erro: 'Parâmetro "endpoint" é obrigatório.' });
  }

  const url = `${process.env.TINY_API_URL}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: method !== 'GET' && payload ? JSON.stringify(payload) : undefined
    });

    const resultado = await response.json().catch(() => ({
      erro: 'Resposta não está em formato JSON',
      status: response.status
    }));

    return res.status(200).json({ url, resultado });
  } catch (err) {
    return res.status(500).json({ erro: 'Falha ao consultar API Tiny', detalhes: err.message });
  }
}