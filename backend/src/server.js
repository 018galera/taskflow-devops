require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Backend TaskFlow rodando na porta ${PORT}`);
  
  // Se estiver no Render, ativa o Keep-Alive nativo (sem bibliotecas)
  const SELF_URL = process.env.RENDER_EXTERNAL_URL;
  
  if (SELF_URL) {
    console.log(`💓 Keep-Alive ativado para: ${SELF_URL}`);
    
    // Faz um ping na própria URL a cada 14 minutos
    setInterval(() => {
      fetch(`${SELF_URL}/health`)
        .then(res => console.log(`💓 Keep-Alive ping: ${res.status}`))
        .catch(err => console.error('Erro no Keep-Alive:', err.message));
    }, 14 * 60 * 1000); // 14 minutos em milissegundos
  }
});