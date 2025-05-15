
import express from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/imagem", upload.single("imagem"), async (req, res) => {
  const { codigo } = req.body;
  const imagemPath = req.file?.path;

  if (!codigo || !imagemPath) {
    return res.status(400).json({ erro: "Código do produto e imagem são obrigatórios" });
  }

  try {
    const formData = new FormData();
    formData.append("token", process.env.TINY_API_TOKEN);
    formData.append("codigo", codigo);
    formData.append("imagem", fs.createReadStream(imagemPath));

    const resposta = await axios.post(
      "https://api.tiny.com.br/api2/produto.imagem.incluir.php",
      formData,
      { headers: formData.getHeaders() }
    );

    fs.unlinkSync(imagemPath); // limpa o arquivo temporário
    res.json({ resultado: resposta.data });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao enviar imagem para o Tiny", detalhes: erro.message });
  }
});

export default router;
