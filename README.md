# API de Gerenciamento de Arquivos JSON

Esta é uma API simples para gerenciar arquivos JSON.

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme necessário

3. Inicie o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm run prod
```

## Deploy na Heroku

1. Instale o Heroku CLI:
```bash
# Windows (com chocolatey)
choco install heroku-cli

# macOS
brew install heroku/brew/heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

2. Faça login na Heroku:
```bash
heroku login
```

3. Crie um novo app na Heroku:
```bash
heroku create seu-app-name
```

4. Configure as variáveis de ambiente na Heroku:
```bash
heroku config:set NODE_ENV=production
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
```

5. Deploy para a Heroku:
```bash
git add .
git commit -m "Preparando para deploy na Heroku"
git push heroku main
```

6. Verifique os logs:
```bash
heroku logs --tail
```

## Configuração para Produção

### Variáveis de Ambiente
- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente (development/production)
- `RATE_LIMIT_WINDOW_MS`: Janela de tempo para rate limiting (padrão: 900000ms = 15min)
- `RATE_LIMIT_MAX_REQUESTS`: Número máximo de requisições por janela (padrão: 100)

### Segurança
- A API inclui proteções contra ataques comuns
- Rate limiting para prevenir sobrecarga
- Headers de segurança com Helmet
- Compressão de resposta
- CORS configurável por ambiente

### Deploy
1. Certifique-se de que todas as variáveis de ambiente estão configuradas
2. Use um processo manager como PM2:
```bash
npm install -g pm2
pm2 start app.js --name "json-api"
```

3. Configure um proxy reverso (nginx/apache) se necessário
4. Configure SSL/TLS para HTTPS

## Endpoints

### Listar todos os arquivos JSON
- **GET** `/json`
- Retorna uma lista com os nomes de todos os arquivos JSON disponíveis

### Obter um arquivo JSON
- **GET** `/json/:filename`
- Retorna o conteúdo do arquivo JSON especificado

### Salvar um arquivo JSON
- **POST** `/json/:filename`
- Salva ou atualiza um arquivo JSON
- O corpo da requisição deve ser um JSON válido

### Deletar um arquivo JSON
- **DELETE** `/json/:filename`
- Remove o arquivo JSON especificado

## Exemplos de Uso

### Salvar um arquivo JSON
```bash
curl -X POST https://seu-app.herokuapp.com/json/exemplo \
  -H "Content-Type: application/json" \
  -d '{"nome": "João", "idade": 30}'
```

### Obter um arquivo JSON
```bash
curl https://seu-app.herokuapp.com/json/exemplo
```

### Deletar um arquivo JSON
```bash
curl -X DELETE https://seu-app.herokuapp.com/json/exemplo
``` 