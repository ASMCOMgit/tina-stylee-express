import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/imagem', async (req, res) => {
  try {
    const { codigo, urlImagem } = req.body;

    if (!codigo || !urlImagem) {
      return res.status(400).json({
        erro: 'Campos obrigatórios ausentes',
        detalhes: 'Informe o código e a urlImagem'
      });
    }

    const payload = {
      produtos: [
        {
          produto: {
            codigo,
            nome: `Produto ${codigo} com imagem`,
            unidade: 'UN',
            preco: '99.90',
            situacao: 'A',
            tipo: 'P',
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

    const data = new URLSearchParams();
    data.append('token', process.env.TOKEN_TINY);
    data.append('formato', 'json');
    data.append('produto', JSON.stringify(payload));

    const response = await axios.post(
      'https://api.tiny.com.br/api2/produto.incluir.php',
      data.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return res.status(200).json({
      url: 'https://api.tiny.com.br/api2/produto.incluir.php',
      resultado: response.data
    });
  } catch (error) {
    return res.status(500).json({
      erro: 'Erro inesperado ao enviar imagem via URL externa',
      detalhes: error.message
    });
  }
});

export default router;
