import express from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import path from "path";

const router = express.Router();

// Armazena os uploads em uma pasta temporária
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    }
  })
});

router.post("/imagem", upload.single("imagem"), async (req, res) => {
  const { codigo } = req.body;
  const imagem = req.file;

  if (!codigo || !imagem) {
    return res.status(400).json({ erro: "Código do produto e imagem são obrigatórios" });
  }

  try {
    const formData = new FormData();
    formData.append("token", process.env.TINY_API_TOKEN);
    formData.append("codigo", codigo);
    formData.append("imagem", fs.createReadStream(imagem.path), {
      filename: imagem.originalname,
      contentType: imagem.mimetype
    });

    const resposta = await axios.post(
      "https://api.tiny.com.br/api2/produto.imagem.incluir.php",
      formData,
      { headers: formData.getHeaders() }
    );

    // Remove a imagem do disco após o upload
    fs.unlinkSync(imagem.path);

    res.json({ resultado: resposta.data });
  } catch (erro) {
    fs.existsSync(imagem.path) && fs.unlinkSync(imagem.path);
    res.status(500).json({ erro: "Erro ao enviar imagem para o Tiny", detalhes: erro.message });
  }
});

export default router;
