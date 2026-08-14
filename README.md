# PST
Trabalho do 3° Ano da 3G de Desenvolvimento Web III

# WikiPlant

Sistema web para catalogação, consulta e localização de plantas.

O WikiPlant permite cadastrar plantas, consultar informações sobre espécies,
visualizar plantas cadastradas em um catálogo e localizar exemplares através
de um mapa.

---

## Tecnologias utilizadas

### Frontend
- React
- Vite
- React Router
- Axios
- Google Maps API

### Backend
- Node.js
- Express
- PostgreSQL
- Cloudinary

### Infraestrutura
- Docker
- Docker Compose

---

# Requisitos

Antes de executar o projeto, instale:

- Node.js
- npm
- Docker Desktop
- Git

Também são necessárias:

- Uma conta no Cloudinary
- Uma chave da Google Maps API

---

# 1. Clonar o projeto

Abra um terminal e execute:

```bash
git clone URL_DO_REPOSITORIO


cd catalogo-de-planta

Na pasta raiz do projeto, execute:

docker compose up -d

Para verificar os containers:

docker compose ps

Para parar os containers:

docker compose down

Entre na pasta do backend:

cd backend
npm install

Crie um arquivo .env:

PORT=3000


DB_HOST=localhost
DB_PORT=5432
DB_NAME=catalogo_plantas
DB_USER=postgres
DB_PASSWORD=postgres


CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

Depois execute:

npm start
4. Frontend

Em outro terminal:

cd frontend
npm install

Crie o .env:

VITE_API_URL=http://localhost:3000
VITE_API_KEY_MAPS=

Execute:

npm run dev

A aplicação estará disponível em:

http://localhost:5173

Cloudinary

O Cloudinary é utilizado para armazenar as imagens das plantas.

É necessário criar uma conta e preencher no .env:

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
Google Maps

É necessária uma chave da Google Maps API para utilizar o mapa.

Adicione a chave ao .env do frontend:

VITE_API_KEY_MAPS=
Variáveis de ambiente

Os arquivos .env não devem ser enviados ao GitHub.

Utilize .env.example para indicar as variáveis necessárias.

Execução rápida
# Banco
docker compose up -d


# Backend
cd backend
npm install
npm start


# Frontend
cd frontend
npm install
npm run dev
