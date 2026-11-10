# WikiPlant - Catálogo de Plantas

Sistema web para catalogação, consulta e geolocalização de espécies de plantas, desenvolvido com React, Node.js (Express) e PostgreSQL.

Consulte o [README principal](../../README.md) na raiz do repositório para instruções detalhadas de arquitetura, segurança e roteiro de defesa.

---

## 🚀 Execução Rápida

### 1. Banco de Dados
Certifique-se de que o banco `catalogo_plantas` foi criado e os scripts foram executados:
```bash
psql -U postgres -d catalogo_plantas -f database/schema.sql
psql -U postgres -d catalogo_plantas -f database/seed.sql
```

### 2. Back-end
```bash
cd back-end
npm install
# Crie o .env conforme .env.example
npm start
```
*Testes automatizados:*
```bash
npm test
```

### 3. Front-end
```bash
cd front-end
npm install
# Crie o .env conforme .env.example
npm run dev
```

---

## 👤 Credenciais de Teste

- **Email:** `ana@email.com` | **Senha:** `123456`
- **Email:** `joao@email.com` | **Senha:** `123456`
- **Email:** `maria@email.com` | **Senha:** `123456`
