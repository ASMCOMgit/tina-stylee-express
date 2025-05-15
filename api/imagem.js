import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Rota para atualizar produto (incluindo imagem externa) usando API V2
router.post('/imagem/atualizar', async (req, res) => {
  try {
    const { codigo, nome, urlImagem, preco } = req.body;

    const produto = {
      produtos: [
        {
          produto: {
            sequencia: '1',
            codigo,
            nome,
            preco,
            origem: '0',
            situacao: 'A',
            tipo: 'P',
            imagens_externas: [
              {
                imagem_externa: {
                  url: urlImagem,
                },
              },
            ],
          },
        },
      ],
    };

    const formData = new FormData();
    formData.append('token', process.env.TINY_API_TOKEN);
    formData.append('formato', 'json');
    formData.append('produto', JSON.stringify(produto));

    const response = await axios.post(
      'https://api.tiny.com.br/api2/produto.alterar.php',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    res.json({ resultado: response.data });
  } catch (error) {
    res.status(500).json({ erro: 'Erro inesperado ao atualizar imagem', detalhes: error.message });
  }
});

export default router;
