# WikiPlant - Catálogo e Localização de Plantas

Sistema web para catalogação, consulta e geolocalização de espécies de plantas da região, desenvolvido como projeto da disciplina de Desenvolvimento Web III (3° Ano do IFC).

O WikiPlant permite que usuários públicos consultem espécies catalogadas e visualizem suas localizações no mapa interativo. Usuários autenticados podem cadastrar novas plantas com upload de fotos, descrições detalhadas e posicionamento geográfico exato via mapa.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** & **Express**
- **PostgreSQL** (Banco de dados relacional)
- **bcryptjs** (Hash e salt seguro de senhas)
- **jsonwebtoken (JWT)** (Autenticação baseada em tokens seguros)
- **Multer** (Processamento de uploads de imagens)
- **Cloudinary** (Armazenamento em nuvem com fallback automático para disco local em `uploads/`)

### Frontend
- **React 19**
- **Vite**
- **React Router DOM**
- **Axios** (com interceptor automático de token JWT)
- **@react-google-maps/api** (Google Maps)

### Infraestrutura
- **Docker** & **Docker Compose**

---

## 🔒 Melhorias de Segurança Implementadas

1. **Armazenamento Seguro de Senhas (bcrypt)**:
   - As senhas nunca são armazenadas em texto simples. Utiliza-se o algoritmo `bcrypt` com fator de custo (salt rounds) 10.
   - Tanto novos cadastros quanto as credenciais padrão do `seed.sql` utilizam hashes bcrypt.
   - No login, a comparação é realizada através de `bcrypt.compare`.

2. **Proteção e Não Exposição de Dados Sensíveis**:
   - As respostas de todas as rotas da API (`GET /users`, `GET /users/:id`, `GET /users/me`, `POST /users`, `POST /users/validate`) removem explicitamente o campo `senha`, impedindo o vazamento de senhas ou seus hashes.

3. **Autenticação Real no Back-end e Front-end (JWT)**:
   - Substituição da autenticação simulada por tokens JWT com expiração de 7 dias.
   - Middleware `authenticateToken` protegendo rotas que exigem usuário homologado/autenticado:
     - `POST /plants`, `PUT /plants/:id`, `DELETE /plants/:id`
     - `POST /markers`, `DELETE /markers/:id`
     - `GET /users`, `GET /users/me`, `PUT /users/:id`, `DELETE /users/:id`
   - O front-end mantém a sessão autenticada via `localStorage`, validando o token na inicialização e injetando o cabeçalho `Authorization: Bearer <token>` em todas as requisições via interceptor do Axios.

4. **Persistência Confiável de Imagens e Localização**:
   - Upload de imagens suporta Cloudinary ou armazenamento em disco local (`/uploads`), garantindo que fotos permaneçam disponíveis mesmo após reinício do servidor.
   - Coordenadas geográficas salvas com precisão de ponto flutuante (`DOUBLE PRECISION`) no PostgreSQL, mantendo exata correspondência no mapa e prevenindo sobreposições indevidas de geolocalização.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (versão 14 ou superior) **OU** [Docker Desktop](https://www.docker.com/)
- [Git](https://git-scm.com/)

---

## 🚀 Instalação e Execução

### Opção A: Execução Local (Recomendada para Desenvolvimento)

#### 1. Criar o Banco de Dados PostgreSQL
No terminal ou ferramenta de sua preferência (psql, pgAdmin, DBeaver):

```sql
CREATE DATABASE catalogo_plantas;
```

Em seguida, execute os scripts na ordem:
1. `catalogo-de-planta/database/schema.sql` (Criação das tabelas)
2. `catalogo-de-planta/database/seed.sql` (Carga inicial de usuários com hash bcrypt, gêneros, plantas e marcadores)

Via terminal com `psql`:
```bash
psql -U postgres -d catalogo_plantas -f catalogo-de-planta/database/schema.sql
psql -U postgres -d catalogo_plantas -f catalogo-de-planta/database/seed.sql
```

---

#### 2. Configurar e Iniciar o Back-end

Navegue até a pasta do back-end:
```bash
cd catalogo-de-planta/back-end
npm install
```

Crie o arquivo `.env` na pasta `catalogo-de-planta/back-end/` (copiando do `.env.example`):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_plantas
DB_USER=postgres
DB_PASSWORD=sua_senha_do_postgres
JWT_SECRET=super-secret-key-wikiplant-2026

# Opcional (se não fornecido, as fotos serão salvas localmente na pasta uploads/)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Inicie o servidor back-end:
```bash
npm start
```
> O servidor estará rodando em: `http://localhost:3000`

Para rodar os testes automatizados de integração e segurança:
```bash
npm test
```

---

#### 3. Configurar e Iniciar o Front-end

Em outro terminal, navegue até a pasta do front-end:
```bash
cd catalogo-de-planta/front-end
npm install
```

Crie o arquivo `.env` na pasta `catalogo-de-planta/front-end/` (copiando do `.env.example`):
```env
VITE_API_URL=http://localhost:3000
VITE_API_KEY_MAPS=sua_chave_do_google_maps_aqui
```

Inicie o servidor de desenvolvimento do front-end:
```bash
npm run dev
```
> A aplicação estará disponível em: `http://localhost:5173`

---

### Opção B: Execução com Docker Compose

Caso possua o Docker instalado, você pode subir o banco PostgreSQL e os serviços com:

```bash
cd catalogo-de-planta
docker compose up -d
```

Para verificar o status:
```bash
docker compose ps
```

Para parar os containers:
```bash
docker compose down
```

---

## 👤 Credenciais Pré-cadastradas para Testes

As contas abaixo já vêm cadastradas no banco (`seed.sql`), com senhas armazenadas em formato de hash bcrypt:

| Usuário | E-mail | Senha |
|---|---|---|
| Ana Silva | `ana@email.com` | `123456` |
| João Santos | `joao@email.com` | `123456` |
| Maria Oliveira | `maria@email.com` | `123456` |

---

## 🎯 Roteiro para a Defesa do Trabalho

### 1. Demonstração do Armazenamento Seguro de Senhas
Abra o cliente do PostgreSQL (psql, pgAdmin ou DBeaver) e consulte a tabela de usuários:
```sql
SELECT id, nome, email, senha FROM usuarios;
```
- **Resultado comprovado**: As senhas são exibidas no padrão `$2b$10$...` (hash bcrypt), não permitindo que administradores ou invasores visualizem o texto original.

### 2. Demonstração da Não Exposição de Senhas na API
Faça uma requisição para a rota de usuários autenticada:
```bash
GET http://localhost:3000/users
Authorization: Bearer <TOKEN>
```
- **Resultado comprovado**: O JSON retornado contém apenas `id`, `nome`, `email` e `cep`. O campo `senha` não existe na resposta.

### 3. Demonstração da Proteção de Rotas (Autenticação Real)
- Tente fazer uma requisição `POST /plants` sem cabeçalho `Authorization`:
  - **Retorno**: `401 Unauthorized` (`"Acesso negado. Token de autenticação não fornecido."`).
- Efetue login com `ana@email.com` / `123456` -> recebe o token JWT -> envie a requisição com `Bearer <token>` -> **Retorno**: `201 Created`.

### 4. Demonstração do Cadastro, Imagem e Localização Persistente
1. Com usuário logado, acesse a página **Cadastrar Planta**.
2. Preencha nome, gênero, descrição, faça upload de uma foto e clique no mapa para selecionar a localização.
3. Clique em **Salvar Planta**. A aplicação redirecionará para `/maps?id=<NOVA_PLANTA>`.
4. Observe que o mapa centraliza no marcador recém-criado, com a foto e os dados correspondentes.
5. Reinicie o back-end (`Ctrl+C` e `npm start`) e recarregue a página no navegador.
6. A planta, a imagem e as coordenadas permanecem exatamente onde foram salvas!
