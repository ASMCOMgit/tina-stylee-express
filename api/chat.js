import { OpenAI } from 'openai';
import { accessToken } from './auth.js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function chatHandler(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt ausente' });
  if (!accessToken) return res.status(401).json({ error: 'Token de autenticação não encontrado' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Você é a TINA, assistente da STYLEE. Receba comandos em linguagem natural e converta em JSON para a API do Tiny ERP.
Sempre responda com: { endpoint, method, payload } com nomes em português e sem URL completa.
Exemplo: { "endpoint": "produtos", "method": "POST", "payload": { "produto": { "nome": "Bolsa", "codigo": "ABC123" } } }
Comando: ${prompt}`
      }]
    });

    const interpreted = JSON.parse(completion.choices[0].message.content);
    const url = `${process.env.TINY_API_URL}/${interpreted.endpoint}`;
    const response = await fetch(url, {
      method: interpreted.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(interpreted.payload)
    });

    const resultado = await response.json().catch(() => ({
      erro: 'Resposta malformada ou vazia do Tiny',
      status: response.status
    }));

    res.json({
      mensagem: 'Comando executado com sucesso!',
      promptInterpretado: interpreted,
      resultadoTiny: resultado
    });

  } catch (err) {
    console.error('[ERRO TINA]', err);
    res.status(500).json({ error: 'Erro ao processar o comando', detalhes: err.message });
  }
}