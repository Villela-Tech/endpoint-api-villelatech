require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de segurança e performance
app.use(helmet()); // Adiciona headers de segurança
app.use(compression()); // Comprime respostas
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://seu-dominio.com'] // Substitua pelo seu domínio
    : '*'
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutos
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100 // limite de requisições
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Diretório onde os arquivos JSON serão armazenados
const JSON_DIR = path.join(__dirname, 'json_files');

// Criar diretório se não existir
(async () => {
  try {
    await fs.access(JSON_DIR);
  } catch {
    await fs.mkdir(JSON_DIR);
  }
})();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// GET - Obter um arquivo JSON
app.get('/json/:filename', async (req, res) => {
  try {
    const filePath = path.join(JSON_DIR, `${req.params.filename}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    } else {
      console.error('Erro ao ler arquivo:', error);
      res.status(500).json({ error: 'Erro ao ler arquivo' });
    }
  }
});

// POST - Salvar um arquivo JSON
app.post('/json/:filename', async (req, res) => {
  try {
    const filePath = path.join(JSON_DIR, `${req.params.filename}.json`);
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
    res.status(201).json({ message: 'Arquivo JSON salvo com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
    res.status(500).json({ error: 'Erro ao salvar arquivo' });
  }
});

// DELETE - Deletar um arquivo JSON
app.delete('/json/:filename', async (req, res) => {
  try {
    const filePath = path.join(JSON_DIR, `${req.params.filename}.json`);
    await fs.unlink(filePath);
    res.json({ message: 'Arquivo JSON deletado com sucesso' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Arquivo não encontrado' });
    } else {
      console.error('Erro ao deletar arquivo:', error);
      res.status(500).json({ error: 'Erro ao deletar arquivo' });
    }
  }
});

// GET - Listar todos os arquivos JSON
app.get('/json', async (req, res) => {
  try {
    const files = await fs.readdir(JSON_DIR);
    const jsonFiles = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    res.json(jsonFiles);
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`);
}); 