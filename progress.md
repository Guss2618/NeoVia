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
- Iniciada a reducao dos cards de rotas favoritas para 100px de altura.
- Cards de rotas favoritas reduzidos para 100px com layout horizontal compacto e todas as informacoes preservadas.
- Build de producao validado com `npm run build`.
- Iniciada a compactacao do card de saldo para reduzir aproximadamente 50px de altura.
- Card de saldo compactado com reducao aproximada de 50px, preservando todas as informacoes.
- Build de producao validado com `npm run build` apos a compactacao do card de saldo.
- Iniciada a compactacao da tela `/inicio` para exibir busca, rotas favoritas e cartao sem rolagem em telas com 667px de altura.
- Tela `/inicio` compactada para o alvo de 667px, com cards de rotas favoritas reduzidos para 72px e espacamentos verticais ajustados.
- Build de producao validado com `npm run build` apos a compactacao da tela `/inicio`.
- Iniciada a criacao e troca para a branch `gabriel`.
- Branch `gabriel` criada e ativada.
- Iniciada a simplificacao dos titulos das secoes de rotas favoritas e cartao na tela `/inicio`.
- Removidos o texto `Acesso rapido` e o icone de onibus do cabecalho de rotas favoritas.
- Adicionado o titulo `Cartao` acima do card de saldo com a mesma formatacao de `Rotas favoritas`.
- Build de producao validado com `npm run build` apos a simplificacao dos titulos da tela `/inicio`.
- Iniciada a reformulacao da pagina de cartao com saldo, recarga, extrato e informacoes do usuario.
- Pagina de cartao reformulada com replica visual do passe no topo, botao de recarga em destaque, opcao de gerar extrato, dados do cartao e movimentacoes recentes.
- Versao do sistema atualizada para MVP v0.0.7.
- Build de producao validado com `npm run build` apos a reformulacao da pagina de cartao.
- Iniciada a discretizacao do botao de versao MVP na tela inicial.
- Botao de versao MVP na tela inicial ajustado para texto discreto sem fundo azul.
- Historico da MVP v0.0.7 atualizado com a alteracao visual do botao de versao.
- Build de producao validado com `npm run build` apos o ajuste visual.

## MVP v0.0.8

- Iniciada a reformulacao do cabecalho superior da tela inicial.
- Cabecalho superior da tela inicial atualizado com logotipo no canto esquerdo e botoes falsos de notificacoes e perfil no canto direito.
- Textos `Bom dia` e `NeoVIa` removidos do bloco antigo do canto superior esquerdo.
- Versao do sistema atualizada para MVP v0.0.8 em `agents.md`, tela inicial e historico de versoes.
- Build de producao validado com `npm run build` apos a reformulacao do cabecalho.

## MVP v0.0.9

- Iniciada a alteracao do menu superior da tela inicial para fundo branco.
- Menu superior da tela inicial atualizado com fundo branco, borda inferior e sombra leve.
- Cores do logotipo, botoes falsos de notificacoes e perfil e indicador de versao ajustadas para o novo fundo branco.
- Versao do sistema atualizada para MVP v0.0.9 em `agents.md`, tela inicial e historico de versoes.
- Build de producao validado com `npm run build` apos o ajuste do menu superior.
- Rota local `/inicio` validada com status 200 e HTML contendo o cabecalho branco atualizado.

## MVP v0.0.10

- Iniciada a centralizacao do texto de versao MVP entre a logo e os icones do menu superior.
- Texto de versao MVP reposicionado no centro do menu superior, entre a logo e os icones de notificacoes e perfil.
- Layout do cabecalho ajustado para manter logo, versao e icones alinhados na mesma linha.
- Versao do sistema atualizada para MVP v0.0.10 em `agents.md`, tela inicial e historico de versoes.
- Build de producao validado com `npm run build` apos o reposicionamento da versao no cabecalho.
- Rota local `/inicio` validada com status 200 e HTML contendo a ordem logo, versao e icones.

## MVP v0.0.11

- Iniciada a adicao do menu superior compartilhado na pagina de cartao e o aumento do espacamento ate o input de rota.
- Cabecalho superior extraido para `components/AppTopBar.tsx`.
- Menu superior compartilhado adicionado a pagina de cartao.
- Distancia entre o menu superior e o input `Escolha sua rota` aumentada na tela inicial.
- Versao do sistema atualizada para MVP v0.0.11 em `agents.md`, tela inicial, pagina de cartao e historico de versoes.
- Build de producao validado com `npm run build` apos a adicao do cabecalho compartilhado.
- Rotas locais `/inicio` e `/recarga` validadas com status 200 e HTML contendo o menu superior atualizado.

## MVP v0.0.12

- Iniciada a troca do texto de ultima atualizacao no card de cartao da tela inicial por um botao de recarga.
- Texto de ultima atualizacao no card de cartao da tela inicial substituido por botao `Recarregar cartão`.
- Botao `Recarregar cartão` configurado como link para `/recarga`.
- Versao do sistema atualizada para MVP v0.0.12 em `agents.md`, tela inicial, pagina de cartao e historico de versoes.
- Build de producao validado com `npm run build` apos a troca no card de cartao.
- Rota local `/inicio` validada com status 200 e HTML contendo o novo botao de recarga.

## MVP v0.0.13

- Iniciada a harmonizacao das cores do botao `Recarregar cartão` na tela inicial com o indicador de ultima atualizacao da pagina de cartao.
- Botao `Recarregar cartão` no card da tela inicial atualizado para `bg-white/10` e `text-white/80`, acompanhando o indicador de ultima atualizacao da pagina de cartao.
- Versao do sistema atualizada para MVP v0.0.13 em `agents.md`, tela inicial, pagina de cartao e historico de versoes.
- Build de producao validado com `npm run build` apos a harmonizacao visual do botao.
- Rota local `/inicio` validada com status 200 e HTML contendo as novas classes do botao de recarga.

## MVP v0.0.14

- Iniciada a alteracao da cor dos nomes das rotas favoritas na tela inicial.
- Nomes das rotas favoritas atualizados para `hsl(228.51deg 100% 19.94%)`.
- Versao do sistema atualizada para MVP v0.0.14 em `agents.md`, tela inicial, pagina de cartao e historico de versoes.
- Build de producao validado com `npm run build` apos o ajuste de cor das rotas favoritas.
- Rota local `/inicio` validada com status 200 e HTML contendo a nova classe de cor das rotas favoritas.

## MVP v0.0.15

- Iniciada a criacao da experiencia de recarga de cartao com saldo atual, valores de deposito e metodos de pagamento.
- Pagina `/recarga` reformulada com saldo atual, selecao de valores de deposito, selecao de metodo de pagamento, resumo de taxas e saldo apos recarga.
- Dados da recarga adicionados em `data/cartao.json` e expostos pela API Route `/api/cartao`.
- Versao do sistema atualizada para MVP v0.0.15 em `agents.md`, tela inicial, pagina de recarga e historico de versoes.
- Build de producao validado com `npm run build` apos a criacao da pagina de recarga.
- Rotas locais `/recarga` e `/versoes` validadas com status 200; API local `/api/cartao` validada com dados de saldo, valores e metodos de pagamento.

## MVP v0.0.16

- Iniciada a separacao da pagina de cartao e da pagina especifica de recarga e pagamento.
- Pagina `/recarga/pagamento` criada com os componentes de proxima recarga, escolha de valor, input de valor personalizado e metodo de pagamento.
- Pagina `/recarga` voltou a funcionar como area do cartao, com botao `Realizar recarga` redirecionando para `/recarga/pagamento`.
- Atalho de recarga da tela inicial atualizado para apontar para `/recarga/pagamento`.
- Menu inferior ocultado apenas no fluxo `/recarga/pagamento` para aumentar a area util da tela e reduzir a necessidade de rolagem.
- Versao do sistema atualizada para MVP v0.0.16 em `agents.md`, tela inicial, paginas de recarga e historico de versoes.
- Build de producao validado com `npm run build` apos a separacao do fluxo de pagamento.
- Rotas locais `/recarga`, `/recarga/pagamento` e `/api/cartao` validadas com status 200.
