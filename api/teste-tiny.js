import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST(request) {
  try {
    const { endpoint, method, payload } = await request.json();

    const tokenPath = path.join(__dirname, '..', 'token.json');
    const tokenData = JSON.parse(readFileSync(tokenPath, 'utf-8'));
    const accessToken = tokenData?.token?.access_token;

    if (!accessToken) {
      return new Response(JSON.stringify({ erro: 'Token de acesso não encontrado' }), { status: 401 });
    }

    const tinyUrl = `https://api.tiny.com.br/api/v3/${endpoint}`;
    const tinyResponse = await fetch(tinyUrl, {
      method: method || 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: method === 'POST' ? JSON.stringify(payload) : undefined
    });

    const result = await tinyResponse.json();

    return new Response(JSON.stringify(result), {
      status: tinyResponse.status,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ erro: 'Erro ao chamar a API do Tiny', detalhes: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
