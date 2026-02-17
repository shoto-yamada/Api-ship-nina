const express = require("express");
const Canvas = require("canvas");
const fetch = require("node-fetch");

const app = express();

// Configurações de Canvas
Canvas.registerFont('./fonts/arial.ttf', { family: 'Arial' }); // Se quiser fonte custom, coloque na pasta fonts

app.get("/ship-card", async (req, res) => {
  try {
    const { user1, user2, avatar1, avatar2 } = req.query;
    if (!user1 || !user2 || !avatar1 || !avatar2) {
      return res.status(400).send("Parâmetros insuficientes. Use: user1, user2, avatar1, avatar2");
    }

    // Canvas
    const width = 700;
    const height = 300;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fundo gradiente bege
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f5f5dc");
    gradient.addColorStop(1, "#eae0c8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Carregar avatares
    const avatarImg1 = await Canvas.loadImage(avatar1);
    const avatarImg2 = await Canvas.loadImage(avatar2);

    // Desenhar avatares circulares
    const avatarSize = 120;

    // Avatar 1
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, height / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg1, 90, height / 2 - avatarSize / 2, avatarSize, avatarSize);
    ctx.restore();

    // Avatar 2
    ctx.save();
    ctx.beginPath();
    ctx.arc(width - 150, height / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg2, width - 210, height / 2 - avatarSize / 2, avatarSize, avatarSize);
    ctx.restore();

    // Nomes
    ctx.fillStyle = "#333";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(user1, 150, height - 40);
    ctx.fillText(user2, width - 150, height - 40);

    // Corações fofos no meio
    const hearts = ["<:nina_love:1473421005790777414>", "<:nina_like:1473421010278809725>"];
    ctx.font = "50px Arial";
    ctx.fillText("❤️", width / 2, height / 2 + 20); // emoji genérico, Discord não renderiza emojis no Canvas
    // Se quiser usar sprites PNG de emoji da Nina, pode carregar via Canvas.loadImage

    // Enviar imagem
    const buffer = canvas.toBuffer("image/png");
    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao gerar o Ship Card.");
  }
});

// Render exige 0.0.0.0 e porta do ambiente
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`API Ship Card rodando na porta ${PORT}`));
