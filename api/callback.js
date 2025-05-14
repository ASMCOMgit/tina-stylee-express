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
    const response = await fetch('https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await response.json();

    if (data.access_token) {
      res.json({ message: '✅ Token recebido com sucesso!', token: data });
    } else {
      res.status(401).json({ error: 'Não foi possível obter o token', resposta: data });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar token', detalhes: error.message });
  }
}
