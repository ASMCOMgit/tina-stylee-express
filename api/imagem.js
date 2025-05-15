// api/imagem.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/imagem', async (req, res) => {
  const { codigo, nome, urlImagem } = req.body;

  if (!codigo || !nome || !urlImagem) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios ausentes: codigo, nome ou urlImagem.' });
  }

  const tinyToken = process.env.TINY_API_TOKEN;
  const url = 'https://api.tiny.com.br/api2/produto.incluir.php';

  const produtoTiny = {
    produtos: [
      {
        produto: {
          sequencia: '1',
          codigo,
          nome,
          unidade: 'UN',
          preco: '0.00',
          tipo: 'P',
          origem: '0',
          situacao: 'A',
          imagens_externas: [
            {
              imagem_externa: {
                url: urlImagem
              }
            }
          ]
        }
      }
    ]
  };

  const payload = new URLSearchParams({
    token: tinyToken,
    formato: 'json',
    produto: JSON.stringify(produtoTiny)
  });

  try {
    const resposta = await axios.post(url, payload.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const resultado = resposta.data;
    return res.json({ resultado });
  } catch (erro) {
    console.error('Erro ao enviar produto com imagem para o Tiny:', erro);
    return res.status(500).json({ erro: 'Erro ao enviar produto com imagem para o Tiny', detalhes: erro.message });
  }
});

export default router;
