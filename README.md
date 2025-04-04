# API de Gerenciamento de Arquivos JSON

API para gerenciamento de arquivos JSON com endpoints RESTful.

## URL Base
```
http://157.90.117.119
```

## Endpoints

### 1. Listar Todos os Arquivos JSON
Retorna uma lista com os nomes de todos os arquivos JSON disponíveis.

- **URL**: `/json`
- **Método**: `GET`
- **Resposta de Sucesso**:
  ```json
  ["arquivo1", "arquivo2", "arquivo3"]
  ```
- **Exemplo**:
  ```bash
  curl http://157.90.117.119/json
  ```

### 2. Obter um Arquivo JSON
Retorna o conteúdo de um arquivo JSON específico.

- **URL**: `/json/:filename`
- **Método**: `GET`
- **Parâmetros URL**:
  - `filename`: Nome do arquivo (sem a extensão .json)
- **Resposta de Sucesso**:
  ```json
  {
    "chave": "valor",
    "outraChave": "outroValor"
  }
  ```
- **Resposta de Erro** (404):
  ```json
  {
    "error": "Arquivo não encontrado"
  }
  ```
- **Exemplo**:
  ```bash
  curl http://157.90.117.119/json/meu-arquivo
  ```

### 3. Salvar/Criar um Arquivo JSON
Salva ou atualiza um arquivo JSON.

- **URL**: `/json/:filename`
- **Método**: `POST`
- **Parâmetros URL**:
  - `filename`: Nome do arquivo (sem a extensão .json)
- **Headers**:
  - `Content-Type: application/json`
- **Corpo da Requisição**:
  ```json
  {
    "chave": "valor",
    "outraChave": "outroValor"
  }
  ```
- **Resposta de Sucesso** (201):
  ```json
  {
    "message": "Arquivo JSON salvo com sucesso"
  }
  ```
- **Exemplo**:
  ```bash
  curl -X POST http://157.90.117.119/json/meu-arquivo \
    -H "Content-Type: application/json" \
    -d '{"nome": "João", "idade": 30}'
  ```

### 4. Deletar um Arquivo JSON
Remove um arquivo JSON específico.

- **URL**: `/json/:filename`
- **Método**: `DELETE`
- **Parâmetros URL**:
  - `filename`: Nome do arquivo (sem a extensão .json)
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Arquivo JSON deletado com sucesso"
  }
  ```
- **Resposta de Erro** (404):
  ```json
  {
    "error": "Arquivo não encontrado"
  }
  ```
- **Exemplo**:
  ```bash
  curl -X DELETE http://157.90.117.119/json/meu-arquivo
  ```

## Limitações e Segurança

- **Rate Limiting**: 100 requisições a cada 15 minutos
- **Tamanho Máximo**: 10MB por arquivo JSON
- **Headers de Segurança**: Helmet configurado
- **Compressão**: Respostas comprimidas
- **CORS**: Configurado para produção

## Exemplos de Uso para Desenvolvedores

### Exemplo 1: Configurações do Sistema
```bash
# Salvar configurações
curl -X POST http://157.90.117.119/json/config \
  -H "Content-Type: application/json" \
  -d '{
    "sistema": {
      "nome": "Sistema Principal",
      "versao": "1.0.0",
      "configuracoes": {
        "tema": "escuro",
        "idioma": "pt-BR",
        "timezone": "America/Sao_Paulo"
      }
    }
  }'

# Recuperar configurações
curl http://157.90.117.119/json/config
```

### Exemplo 2: Dados de Usuários
```bash
# Salvar lista de usuários
curl -X POST http://157.90.117.119/json/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "usuarios": [
      {
        "id": 1,
        "nome": "João Silva",
        "email": "joao@empresa.com",
        "departamento": "TI",
        "permissoes": ["admin", "user"]
      },
      {
        "id": 2,
        "nome": "Maria Santos",
        "email": "maria@empresa.com",
        "departamento": "RH",
        "permissoes": ["user"]
      }
    ]
  }'
```

### Exemplo 3: Logs do Sistema
```bash
# Salvar logs
curl -X POST http://157.90.117.119/json/logs-sistema \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      {
        "timestamp": "2024-04-04T23:30:00Z",
        "nivel": "INFO",
        "mensagem": "Sistema iniciado",
        "usuario": "sistema"
      },
      {
        "timestamp": "2024-04-04T23:31:00Z",
        "nivel": "ERROR",
        "mensagem": "Falha na conexão",
        "usuario": "admin"
      }
    ]
  }'
```

## Troubleshooting

### Problemas Comuns e Soluções

1. **Erro 404 - Arquivo não encontrado**
   - Verifique se o nome do arquivo está correto
   - Confirme se o arquivo foi criado anteriormente
   - Use o endpoint GET `/json` para listar arquivos existentes

2. **Erro ao salvar arquivo**
   - Verifique se o JSON está bem formatado
   - Confirme se o Content-Type está correto
   - Verifique se o tamanho do arquivo não excede 10MB

3. **Rate Limiting**
   - Limite: 100 requisições a cada 15 minutos
   - Implemente cache no lado do cliente
   - Use bulk operations quando possível

4. **CORS Issues**
   - A API está configurada para aceitar requisições de qualquer origem em desenvolvimento
   - Em produção, configure o domínio correto no header Origin

### Dicas para Desenvolvedores

1. **Cache**
   - Implemente cache no lado do cliente
   - Use ETags para verificar se o conteúdo mudou
   - Armazene dados frequentemente acessados localmente

2. **Bulk Operations**
   - Para múltiplas operações, considere criar um único arquivo JSON
   - Use arrays para armazenar múltiplos itens
   - Implemente paginação para grandes conjuntos de dados

3. **Monitoramento**
   - Verifique os logs do servidor para erros
   - Monitore o uso do rate limiting
   - Implemente retry logic para falhas temporárias

## Códigos de Status

- **200**: Sucesso
- **201**: Criado com sucesso
- **404**: Arquivo não encontrado
- **500**: Erro interno do servidor

## Observações

- Os arquivos são armazenados no servidor
- Não é necessário incluir a extensão .json no nome do arquivo
- O corpo das requisições POST deve ser um JSON válido
- As respostas são sempre em formato JSON 