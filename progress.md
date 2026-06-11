# Progresso NeoVIa

## MVP v0.0.1

- Criada a primeira tela de carregamento web estatica com fundo azul escuro, card central e icone de onibus.

## MVP v0.0.2

- Inicio da conversao para app mobile com Expo para permitir testes no Expo Go via QR Code.
- Projeto Expo iniciado com tela de carregamento mobile e QR Code local em `expo-qr.svg`.
- Corrigido carregamento infinito no Expo Go alinhando as versoes do React/React Native com o SDK Expo, instalando `expo-status-bar` e usando `expo/AppEntry` como ponto de entrada.

## MVP v0.0.3

- Iniciada a recriacao do projeto com React, Next.js, Tailwind CSS e Lucide React conforme `agents.md`.
- Projeto recriado com Next.js App Router, Tailwind CSS via `tailwind.config.js`, Lucide React, tela inicial mobile-first, pagina de historico de versoes e API Route consumindo `data/versoes.json`.
- Build de producao validado com `npm run build`.

## MVP v0.0.4

- Removido o componente de tela de carregamento da tela inicial.
- Adicionado botao `Começar` na tela inicial apontando para `/inicio`.
- Criadas paginas iniciais para os modulos `/horarios`, `/recarga` e `/rotas`.

## MVP v0.0.5

- Pagina `/inicio` reformulada com estrutura mobile-first.
- Adicionado input `Escolha sua rota` com icone de lupa no topo.
- Adicionada secao `Rotas favoritas` com dois componentes de rota.
- Adicionado card de saldo do passe com icone de cartao.
- Adicionado menu inferior fixo com quatro opcoes: Inicio, Cartao, Horarios e Rotas.

## MVP v0.0.6

- Menu inferior extraido para `components/BottomNav.tsx`.
- Menu inferior adicionado ao `app/layout.tsx` para ficar presente em todas as paginas.
- Removida a duplicacao do menu em `/inicio`.
- Ajustado padding inferior das paginas para evitar que o menu fixo cubra o conteudo.
