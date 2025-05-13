const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const LOG_FILE = 'logs.txt';

function registrarMensagem(nome) {
  const id = uuidv4();
  const dataHora = new Date().toISOString();
  const mensagem = `${id}-${dataHora}-${nome}\n`;
  fs.appendFileSync(LOG_FILE, mensagem, 'utf8');
  return id;
}

const app = express();

app.use(express.json());

app.post('/logs', (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: 'nome é obrigatório.' });
  }
  const idGerado = registrarMensagem(nome);
  res.status(201).json({ id: idGerado, mensagem: 'Log registrado com sucesso.' });
});

app.get('/logs/:id', (req, res) => {
  const { id } = req.params;
  if (!fs.existsSync(LOG_FILE)) {
    return res.status(404).json({ erro: 'Não encontrado.' });
  }
  const conteudo = fs.readFileSync(LOG_FILE, 'utf8');
  const linhas = conteudo.trim().split('\n');

  const logEncontrado = linhas.find(linha => linha.startsWith(`${id}-`));

  if (logEncontrado) {
    res.status(200).json({ mensagem: logEncontrado });
  } else {
    res.status(404).json({ erro: `Log com ID '${id}' não encontrado.` });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});