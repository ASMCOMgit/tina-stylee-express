import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function chatHandler(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt ausente' });

  let accessToken = null;
  const tokenPath = path.resolve('utils/token.json');
  if (fs.existsSync(tokenPath)) {
    const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    accessToken = tokenData.access_token;
  }

  if (!accessToken) return res.status(401).json({ error: 'Token de autenticação não encontrado' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `
Você é a TINA, uma assistente virtual da STYLEE integrada ao Tiny ERP.

Sua missão é interpretar comandos em linguagem natural e responder com um JSON técnico no formato:

{
  "endpoint": "produtos",
  "method": "POST",
  "payload": {
    "produto": {
      "nome": "...",
      "codigo": "...",
      "preco": 0.0,
      "estoque": 0,
      "unidade": "UN",
      "tipo": "P",
      "situacao": "A"
    }
  }
}

⚠️ Regras obrigatórias:
- Use "preco" (nunca "valor")
- Sempre inclua: nome, codigo, preco, estoque, unidade, tipo, situacao
- Se o comando já tiver todas as informações, monte o JSON direto, sem pedir confirmações
- Se o comando não for técnico, responda de forma educada como assistente virtual
          `.trim()
        },
        { role: 'user', content: prompt }
      ]
    });

    const resposta = completion.choices[0].message.content.trim();

    let interpreted;
    try {
      interpreted = JSON.parse(resposta);
    } catch (jsonErr) {
      return res.json({ mensagem: resposta });
    }

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