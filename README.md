# NeoVIa

Plataforma unificada para facilitar o acesso digital ao transporte público. O NeoVIa reúne, em um só lugar, informações de horários, planejamento de rotas e consulta do cartão de transporte — tudo pensado para ser simples de usar no celular e no computador.

## O que é o NeoVIa?

O NeoVIa nasceu para resolver um problema comum: hoje, quem usa ônibus muitas vezes precisa recorrer a vários sites, apps ou pontos físicos para saber horários, recarregar o cartão ou descobrir qual linha leva até o destino.

Nossa proposta é unificar essas necessidades em uma experiência clara, moderna e acessível.

## Principais funcionalidades

### Horários

Consulte os horários de saída das linhas de ônibus de forma fácil e rápida.

Inspirado na praticidade de serviços como o Jotur, o NeoVIa traz a mesma ideia de consulta de linhas, com uma interface mais limpa, organizada e agradável de usar.

### Rotas — “Para onde você quer ir?”

Informe para onde deseja chegar e veja quais linhas e trajetos estão disponíveis para você.

Funciona de maneira parecida com apps de mobilidade como o Uber: você escolhe o destino e a plataforma sugere caminhos possíveis usando o transporte público.

### Pagamento e créditos

Acompanhe o saldo do seu cartão e acesse o fluxo de recarga online.

Semelhante à experiência oferecida por serviços como o Kim, o objetivo é permitir que o usuário consulte créditos e recarregue o cartão com praticidade, sem precisar ir até um ponto físico.

## Em resumo

O NeoVIa organiza o uso do transporte público em três pilares:

| Área | O que você faz |
| --- | --- |
| **Horários** | Ver quando os ônibus saem |
| **Rotas** | Descobrir como chegar ao seu destino |
| **Pagamento / créditos** | Consultar saldo e recarregar o cartão |

## Como rodar o projeto

Siga os passos abaixo para abrir o NeoVIa no seu computador.

### 1. Instale o Node.js

Baixe e instale a versão recomendada (LTS) em [nodejs.org](https://nodejs.org/).

### 2. Baixe o projeto

Se ainda não tiver o código, clone o repositório ou extraia os arquivos do projeto em uma pasta no seu computador.

### 3. Abra a pasta do projeto no terminal

Entre na pasta principal do NeoVIa. Exemplo:

```bash
cd NeoVIa
```

### 4. Instale as dependências

Execute:

```bash
npm install
```

Esse comando prepara tudo o que o projeto precisa para funcionar.

### 5. Inicie o sistema

Execute:

```bash
npm run dev
```

Quando aparecer a mensagem informando que o servidor está rodando, abra o navegador e acesse:

```
http://localhost:3000
```

### 6. Navegue pelo NeoVIa

Na tela inicial, clique em **Começar** para entrar na plataforma. A partir daí, use o menu inferior para acessar:

- **Início** — visão geral e atalhos
- **Cartão** — saldo e recarga
- **Horários** — consulta de linhas
- **Rotas** — planejamento de trajetos

## Observação sobre esta versão

Esta é uma versão inicial (MVP) focada na experiência de uso. Os dados exibidos são locais e servem para demonstrar o funcionamento da plataforma.

## Versão atual

**MVP v0.0.25**
