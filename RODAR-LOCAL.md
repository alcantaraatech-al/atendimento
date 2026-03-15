# Rodar o projeto localmente

Sim, o projeto consegue rodar via local. Siga os passos abaixo.

## Pré-requisitos

- **Node.js** 18 ou 20 (recomendado)
- **MySQL** ou **MariaDB** (banco obrigatório)
- **Redis** é opcional (só é usado se você definir `REDIS_URL` no `.env` do backend)

---

## 1. Banco de dados MySQL

Crie o banco e um usuário. Exemplo no MySQL:

```sql
CREATE DATABASE whaticket CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
CREATE USER 'whaticket'@'localhost' IDENTIFIED BY 'sua_senha';
GRANT ALL ON whaticket.* TO 'whaticket'@'localhost';
FLUSH PRIVILEGES;
```

Ou use Docker só para o MySQL:

```bash
docker run --name whaticketdb -e MYSQL_ROOT_PASSWORD=strongpassword -e MYSQL_DATABASE=whaticket -e MYSQL_USER=whaticket -e MYSQL_PASSWORD=whaticket --restart always -p 3306:3306 -d mariadb:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_bin
```

---

## 2. Backend

Na pasta do projeto (onde está este RODAR-LOCAL.md):

```bash
cd backend
cp .env.example .env
```

Edite o `.env` e ajuste pelo menos:

- `DB_HOST=localhost`
- `DB_DIALECT=mysql`
- `DB_PORT=3306`
- `DB_NAME=whaticket`
- `DB_USER=root` (ou o usuário que criou)
- `DB_PASS=` (senha do MySQL)
- `PORT=8080`
- `JWT_SECRET` e `JWT_REFRESH_SECRET` (qualquer string segura)
- `BACKEND_URL=http://localhost:8080`
- `FRONTEND_URL=http://localhost:3000`

Instale dependências, compile e rode as migrações + seeds:

```bash
npm install
npm run build
npx sequelize db:migrate
npx sequelize db:seed:all
```

Inicie o backend:

```bash
npm run dev
```

O backend deve subir na porta **8080**. Deixe esse terminal aberto.

---

## 3. Frontend

Em outro terminal, na pasta do projeto:

```bash
cd frontend
cp .env.example .env
```

No `.env` do frontend, deixe assim (ou ajuste se o backend estiver em outra porta):

```
VITE_BACKEND_URL=http://localhost:8080/
```

Instale e inicie:

```bash
npm install
npm run dev
```

O frontend sobe na porta **3000** (Vite abre o navegador).

---

## 4. Uso

1. Acesse: **http://localhost:3000/signup**
2. Crie um usuário e faça login.
3. No menu, vá em **Conexões** e crie uma conexão WhatsApp.
4. Quando aparecer o **QR Code**, escaneie com o WhatsApp do celular.
5. Pronto: as mensagens passam a aparecer nos Tickets.

---

## Observações

- **WhatsApp (wwebjs)**: o backend usa Puppeteer/Chrome. No Linux, às vezes é preciso instalar dependências (libs do README principal). No primeiro uso pode demorar um pouco para baixar o Chromium.
- **Redis**: não é obrigatório para rodar em um único processo. Só é necessário se você configurar `REDIS_URL` no backend (ex.: para sessões do provider whaileys em produção).
- **Credenciais padrão** (após seed): usuário `admin@whaticket.com`, senha `admin` — altere depois.

Se algo falhar, confira se o MySQL está rodando, se o `.env` do backend tem `PORT=8080` e se a URL do frontend aponta para `http://localhost:8080/`.
