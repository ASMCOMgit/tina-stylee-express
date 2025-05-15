// api/imagem.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/imagem', async (req, res) => {
  const { codigo, nome, urlImagem, preco } = req.body;

  if (!codigo || !nome || !urlImagem || !preco) {
    return res.status(400).json({ erro: 'Parâmetros obrigatórios ausentes: codigo, nome, urlImagem ou preco.' });
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
          preco,
          tipo: 'P',
          origem: '0',
          situacao: 'A',
          anexos: [
            {
              anexo: urlImagem
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
