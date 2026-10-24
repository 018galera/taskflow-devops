require('dotenv').config();
const app = require('./app');
const wokeDyno = require('woke-dyno');

const PORT = process.env.PORT || 3001;

// O Render define automaticamente a URL pública na variável RENDER_EXTERNAL_URL
const SELF_URL = process.env.RENDER_EXTERNAL_URL;

app.listen(PORT, () => {
  console.log(`🚀 Backend TaskFlow rodando na porta ${PORT}`);
  
  // Se estiver no Render, ativa o "Keep-Alive" para não dormir
  if (SELF_URL) {
    console.log(`💓 Keep-Alive ativado para: ${SELF_URL}`);
    // Faz um ping na própria URL a cada 14 minutos (padrão da lib)
    wokeDyno(SELF_URL).start();
  }
});