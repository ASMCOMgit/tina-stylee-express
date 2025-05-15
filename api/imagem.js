import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Configurar multer para uploads locais
const upload = multer({ dest: "uploads/" });

router.post("/imagem", upload.single("imagem"), async (req, res) => {
  const codigo = req.body.codigo;
  const file = req.file;

  if (!codigo || !file) {
    return res.status(400).json({ erro: "Código e imagem são obrigatórios" });
  }

  try {
    const formData = new FormData();
    formData.append("token", process.env.TINY_TOKEN);
    formData.append("codigo", codigo);
    formData.append("imagem", fs.createReadStream(file.path), {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(
      "https://api.tiny.com.br/api2/produto.imagem.incluir.php",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    console.log("✅ Envio realizado para:", codigo);
    console.log("📦 Resposta Tiny:", response.data);

    res.json({
      status: "Imagem enviada com sucesso!",
      codigo,
      resposta: response.data,
    });
  } catch (erro) {
    console.error("❌ Erro ao enviar imagem:", erro.message);
    if (erro.response) {
      console.error("📨 Resposta:", erro.response.data);
      res.status(erro.response.status).json({
        erro: "Erro ao enviar imagem para o Tiny",
        detalhes: erro.response.data,
      });
    } else {
      res.status(500).json({
        erro: "Erro inesperado ao enviar imagem",
        detalhes: erro.message,
      });
    }
  } finally {
    // Limpar o arquivo após o uso
    fs.unlink(file.path, () => {});
  }
});

export default router;
