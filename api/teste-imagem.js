// api/teste-imagem.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Apenas POST permitido' });
  }

  const { produtoId } = req.body;
  if (!produtoId) {
    return res.status(400).json({ erro: 'ID do produto não fornecido' });
  }

  const imagens = [
    {
      url: "https://wheat-owl-268189.hostingersite.com/wp-content/uploads/2025/04/STYLEE001-1.png",
      descricao: "Imagem PNG frontal"
    },
    {
      url: "https://wheat-owl-268189.hostingersite.com/wp-content/uploads/2025/04/4040815eaa07216e95a2813063b52dd3.jpg",
      descricao: "Imagem JPG lateral"
    }
  ];

  try {
    const response = await fetch(`https://api.tiny.com.br/public-api/v3/produtos/${produtoId}/imagens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TINY_ACCESS_TOKEN}`
      },
      body: JSON.stringify({ imagens })
    });

    const resultado = await response.json();
    return res.status(response.status).json({ url: response.url, status: response.status, resultado });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao enviar imagem', detalhe: erro.message });
  }
}
