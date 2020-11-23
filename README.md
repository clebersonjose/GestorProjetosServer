# Servidor do projeto Gestor de Projetos

Back-end (API) do Projeto Integrado do cursos de Tecnologia de Analise e Desenvolvimento de Sistemas.

[Documentação da API](https://www.notion.so/clebersonja/Gestor-de-Projetos-Server-f2dac3ce49db455cb8dd14e59da2d3a0)

## Passos para deploy em produção

Clonar repositório:

##### \*Necessário instalar git em sua maquina

```bash
git clone https://github.com/clebersonjose/GestorProjetosServer.git
```

Instalar dependências de produção:

##### \*Necessário instalar yarn em sua maquina

```bash
yarn install --production
```

ou

##### \*Necessário instalar npm em sua maquina

```bash
npm install --production
```

## Configuração banco de dados

A aplicação usa um bando PostgreSQL, para configurar o banco basta copiar o arquivo .env.sample para um arquivo chamado .env e preencher os dados do banco:

```bash
DB_CLIENT=pg
DB_HOST=IPdoBanco
DB_PORT=PortaDoIP
DB_USER=UsuarioDoBanco
DB_PASS=SenhaDoBanco
DB_NAME=NomeDoBanco
```

## Configuração do JWT
No arquivo .env criado anteriormente, deve adicionar a chave de secreta pra a geração dos Tokens de autenticação no campo JWT_SECRET

```bash
JWT_SECRET="Sua-Chave-Secreta"
```

## Testes

### Configurar banco de dados para testes:

Os testes usam SQLite para testar as transações com o banco, para configurar basta copiar o arquivo .env.test.sample para um arquivo .env.test e preencher com "sqlite3":

```bash
DB_CLIENT=sqlite3
```

### Rodar testes:

Para rodar os testes basta usar o comendo test

##### \*Necessário instalar yarn em sua maquina

```bash
yarn test
```

ou

##### \*Necessário instalar npm em sua maquina

```bash
npm run test
```

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
