# Passo a passo para rodar em outra máquina

Siga estes passos na ordem para subir o projeto em um computador novo **sem erros**.

---

## Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Git** (se for clonar) ou os arquivos do projeto copiados na pasta

---

## 1. Obter o código

**Opção A – Clonar o repositório**
```bash
git clone <URL_DO_SEU_REPOSITORIO> atendimento
cd atendimento
```

**Opção B – Copiar a pasta**
Copie a pasta do projeto (a que contém `docker-compose.yaml`, `backend/`, `frontend/`) para a nova máquina e entre nela:
```bash
cd /caminho/para/atendimento
```

---

## 2. Arquivo de ambiente (`.env`)

Na **raiz do projeto** (mesma pasta do `docker-compose.yaml`):

```bash
cp .env.example .env
```

Abra o `.env` e configure pelo menos o seguinte para **uso local**:

```env
# MySQL (pode deixar esses valores para desenvolvimento)
MYSQL_ROOT_PASSWORD=strongpassword
MYSQL_DATABASE=whaticket

# Backend acessível no navegador como http://localhost:8080
BACKEND_URL=http://localhost
PROXY_PORT=8080

# Frontend em http://localhost:3000
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000

# JWT (obrigatório – use strings únicas em produção)
JWT_SECRET=3123123213123
JWT_REFRESH_SECRET=75756756756

# WhatsApp sem depender do Chrome no Docker (recomendado)
WHATSAPP_PROVIDER=whaileys
```

Salve o arquivo. Não é necessário criar `.env` dentro de `backend/` ou `frontend/` para rodar com Docker.

---

## 3. Subir os containers

Na raiz do projeto:

```bash
docker-compose -f docker-compose.yaml up -d --build
```

Aguarde o build terminar. O MySQL sobe primeiro; o backend espera o banco e roda as migrações automaticamente.

---

## 4. Se o backend não subir (erro de “recreate” ou container parado)

Algumas versões do Docker Compose dão erro ao recriar o container. Faça:

```bash
docker-compose -f docker-compose.yaml down
docker rm -f atendimento_backend_1 2>/dev/null || true
docker-compose -f docker-compose.yaml up -d backend
```

Se o **frontend** der problema:

```bash
docker rm -f atendimento_frontend_1 2>/dev/null || true
docker-compose -f docker-compose.yaml up -d frontend
```

---

## 5. Popular o banco (seeds)

Depois que o **backend** estiver rodando (verifique com `docker ps`):

```bash
docker-compose -f docker-compose.yaml exec backend npx sequelize db:seed:all
```

Se aparecer erro de duplicata, os seeds são idempotentes: pode rodar de novo ou ignorar se os dados já existem.

---

## 6. Acessar a aplicação

1. Abra no navegador: **http://localhost:3000**
2. **Criar usuário:** http://localhost:3000/signup  
   Ou use o usuário do seed (se existir): `admin@whaticket.com` / `admin` — **altere a senha depois**.
3. Faça **login**.
4. No menu, vá em **Conexões** e **Adicionar WhatsApp**.
5. Escaneie o **QR Code** com o WhatsApp do celular.

---

## 7. Resumo rápido (copiar e colar)

```bash
# Na raiz do projeto
cp .env.example .env
# Editar .env com BACKEND_URL=http://localhost, PROXY_PORT=8080, FRONTEND_URL=http://localhost:3000, JWT_*, WHATSAPP_PROVIDER=whaileys

docker-compose -f docker-compose.yaml up -d --build
docker-compose -f docker-compose.yaml exec backend npx sequelize db:seed:all
```

Acesse: **http://localhost:3000**

---

## Problemas comuns

| Problema | Solução |
|----------|--------|
| Tela branca ou 403 após login | Fazer **logout** e **login** de novo (token novo). |
| Backend não inicia | `docker-compose down`, `docker rm -f atendimento_backend_1`, depois `up -d backend`. |
| Seed dá erro de duplicata | Normal se já rodou antes. Pode ignorar ou rodar de novo. |
| WebSocket falha / 403 | Token expirado ou inválido. Logout e login novamente. |
| QR Code não aparece ou conexão trava | No `.env` da raiz use `WHATSAPP_PROVIDER=whaileys` (já vem no exemplo para Docker). |

---

## Rodar sem Docker (só desenvolvimento)

Se quiser rodar **backend e frontend na máquina** (sem Docker):

1. Instale **Node.js 18+**, **MySQL** (ou MariaDB) e crie o banco `whaticket`.
2. Siga o guia **RODAR-LOCAL.md** (backend na porta 8080, frontend na 3000).
3. No backend use `WHATSAPP_PROVIDER=whaileys` ou `wwebjs`; no Docker é recomendado `whaileys`.

Com o `.env` da raiz configurado e os comandos acima, o projeto deve rodar em outra máquina sem erros.
