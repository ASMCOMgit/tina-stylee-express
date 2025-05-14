import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export default async function callbackHandler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Código de autorização não fornecido' });
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.TINY_REDIRECT_URI);
  params.append('client_id', process.env.TINY_CLIENT_ID);
  params.append('client_secret', process.env.TINY_CLIENT_SECRET);

  try {
    const response = await fetch('https://api.tiny.com.br/api/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();
    res.json({ message: 'Autenticação concluída com sucesso', data });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter o token', details: error.message });
  }
}