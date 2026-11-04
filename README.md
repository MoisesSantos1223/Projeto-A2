# ⚔ Crônicas de Eldoria — Jogo da Memória RPG

Jogo da memória temático de RPG medieval, com personagens em pixel art, cronômetro, configurações de dificuldade e histórico de partidas. Desenvolvido com **HTML5, CSS3 e JavaScript puro (ES Modules)**, sem frameworks, sem dependências e sem etapa de build.

---

## Sumário

1. [Funcionalidades](#funcionalidades)
2. [Como executar](#como-executar)
3. [Estrutura do projeto](#estrutura-do-projeto)
4. [Páginas](#páginas)
5. [Como o jogo funciona](#como-o-jogo-funciona)
6. [Persistência de dados (localStorage)](#persistência-de-dados-localstorage)
7. [Personagens](#personagens)
8. [Configurações e dificuldade](#configurações-e-dificuldade)
9. [Identidade visual e responsividade](#identidade-visual-e-responsividade)
10. [Vídeo de fundo](#vídeo-de-fundo)
11. [Guia de manutenção](#guia-de-manutenção)
12. [Solução de problemas](#solução-de-problemas)
13. [Tecnologias](#tecnologias)

---

## Funcionalidades

- **Menu principal** com vídeo de fundo e navegação entre as páginas.
- **Partida** com cartas que viram em 3D, contador de movimentos, pares encontrados e **cronômetro**.
- **Três níveis de dificuldade**: 4, 6 ou 8 pares.
- **Compêndio de personagens** com a lista dos heróis do jogo.
- **Configurações** (dificuldade e efeitos sonoros) salvas automaticamente.
- **Histórico de partidas concluídas**, persistente mesmo após fechar ou atualizar o navegador, com opção de limpar (com confirmação).
- **Acessibilidade básica**: `aria-label` nas cartas, foco visível por teclado, `lang="pt-BR"` e vídeo decorativo oculto para leitores de tela.
- **Responsivo**, do desktop ao celular.

---

## Como executar

O projeto usa **módulos JavaScript** (`<script type="module">`). Por restrição dos navegadores, módulos **não funcionam** ao abrir os arquivos diretamente via `file://`. Execute por um servidor HTTP local.

### Opção 1 — VS Code (Live Server)

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, se ainda não tiver.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

### Opção 2 — Python

Na pasta do projeto:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

### Opção 3 — Node.js

```bash
npx serve .
```

> **Requisitos:** um navegador moderno (Chrome, Edge, Firefox ou Safari atuais). As fontes são carregadas do Google Fonts, então é necessária conexão com a internet para a tipografia original; sem ela, o navegador usa fontes substitutas e o jogo continua funcionando.

---

## Estrutura do projeto

```text
rpg-memory-game/
│
├── index.html                  Menu principal (único com vídeo de fundo)
│
├── pages/
│   ├── personagens.html        Compêndio de personagens
│   ├── configuracoes.html      Dificuldade e efeitos sonoros
│   ├── jogo.html               Partida, cronômetro e tela de vitória
│   └── history.html            Histórico de partidas concluídas
│
├── css/
│   └── style.css               Estilos compartilhados por todas as páginas
│
├── js/
│   ├── characters.js           Cadastro de personagens + resolução de caminho de imagem
│   ├── game.js                 Mecânica do jogo (cartas, pares, movimentos, vitória)
│   ├── timer.js                Cronômetro
│   ├── settings.js             Leitura/gravação das configurações (localStorage)
│   ├── history.js              Leitura/gravação/limpeza do histórico (localStorage)
│   └── pages/                  Um script de entrada por página
│       ├── characters-page.js
│       ├── settings-page.js
│       ├── game-page.js
│       └── history-page.js
│
└── imgs/
    ├── characters/             Retratos dos personagens (PNG)
    ├── cards/                  Reservado para imagens de verso de carta
    └── interface/
        └── cards.mp4           Vídeo de fundo do menu
```

### Organização do JavaScript

O código separa **regra de negócio** (módulos na raiz de `js/`) de **ligação com a página** (`js/pages/`):

| Camada       | Arquivos                    | Responsabilidade                                                   |
| ------------ | --------------------------- | ------------------------------------------------------------------ |
| Dados        | `characters.js`             | Lista de personagens e resolução do caminho das imagens            |
| Regras       | `game.js`, `timer.js`       | Jogo da memória e cronômetro, sem conhecer navegação entre páginas |
| Persistência | `settings.js`, `history.js` | Único ponto de acesso ao `localStorage`                            |
| Páginas      | `js/pages/*.js`             | Lê o DOM da página, chama os módulos acima e atualiza a tela       |

Cada página HTML carrega apenas o script da sua própria responsabilidade.

---

## Páginas

| Página         | Arquivo                    | Descrição                                                                                                 |
| -------------- | -------------------------- | --------------------------------------------------------------------------------------------------------- |
| Menu principal | `index.html`               | Tela inicial com vídeo de fundo e quatro opções: Começar aventura, Personagens, Histórico e Configurações |
| Personagens    | `pages/personagens.html`   | Lista os heróis cadastrados em `characters.js`                                                            |
| Configurações  | `pages/configuracoes.html` | Dificuldade e efeitos sonoros, salvos automaticamente                                                     |
| Partida        | `pages/jogo.html`          | Tabuleiro, estatísticas, cronômetro e tela de vitória                                                     |
| Histórico      | `pages/history.html`       | Tabela com as partidas concluídas e botão de limpar                                                       |

### Navegação

A navegação usa **links HTML comuns** (`<a href>`), sem roteador. Os caminhos nas páginas dentro de `pages/` usam `../` para voltar à raiz (por exemplo, `../css/style.css` e `../index.html`).

```text
index.html ──► pages/jogo.html ──► pages/history.html
    │              │
    │              └──► index.html (sair / voltar ao menu)
    ├──► pages/personagens.html
    ├──► pages/configuracoes.html
    └──► pages/history.html
```

---

## Como o jogo funciona

### Início da partida

Ao abrir `jogo.html`, a partida começa automaticamente:

1. A dificuldade é lida de `localStorage` (padrão: _Aventureiro_, 6 pares).
2. Os primeiros _N_ personagens do cadastro são selecionados (_N_ = número de pares).
3. Cada personagem é duplicado, o baralho é **embaralhado** (algoritmo Fisher–Yates) e as cartas são desenhadas.
4. O cronômetro é zerado e iniciado.

### Regras

- Clique em uma carta para virá-la. Ao virar uma segunda, o **movimento** é contabilizado.
- Se as duas cartas forem do **mesmo personagem**, formam um par e ficam travadas (`matched`).
- Se forem diferentes, o tabuleiro é bloqueado por **850 ms** e as duas cartas voltam a ficar viradas para baixo.
- Enquanto duas cartas estão em comparação, novos cliques são ignorados.
- A partida termina quando **todos os pares** são encontrados.

### Cronômetro (`timer.js`)

- Calcula o tempo decorrente a partir de `Date.now()`, por isso **não acumula atraso** mesmo se a aba ficar em segundo plano.
- Atualiza a tela a cada 250 ms, no formato `MM:SS`.
- Ao concluir o jogo, `stopTimer()` congela e retorna o **tempo final**, que é exibido na tela de vitória e gravado no histórico.

### Fim da partida

Ao encontrar o último par:

1. O cronômetro é parado e o tempo final é capturado.
2. O resultado é gravado no histórico (`registerMatch`).
3. A **tela de vitória** mostra tempo total e movimentos.
4. O jogador pode **Jogar novamente** (reinicia na mesma página), **Ver histórico** ou **Voltar ao menu**.

> **Partidas abandonadas não são registradas.** O histórico só é gravado quando todos os pares são encontrados. Clicar em _Sair da partida_ ou fechar a página não salva nada.

---

## Persistência de dados (localStorage)

O projeto usa duas chaves, ambas com valor em JSON.

### `eldoria:settings`

```json
{ "difficulty": "normal", "sound": true }
```

| Campo        | Valores                        | Padrão     |
| ------------ | ------------------------------ | ---------- |
| `difficulty` | `"easy"`, `"normal"`, `"hard"` | `"normal"` |
| `sound`      | `true` / `false`               | `true`     |

### `eldoria:history`

Lista de partidas concluídas, em ordem cronológica:

```json
[
  {
    "id": 1,
    "data": "2026-11-04T03:54:12.562Z",
    "tempo": "01:05",
    "movimentos": 14,
    "resultado": "Vitoria"
  }
]
```

| Campo        | Descrição                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `id`         | Identificador da partida. Calculado como _maior id existente + 1_, então nunca se repete, mesmo após limpar o histórico |
| `data`       | Data e hora de conclusão em formato ISO 8601 (UTC); exibida na página no fuso local, em `pt-BR`                         |
| `tempo`      | Tempo total no formato `MM:SS`                                                                                          |
| `movimentos` | Quantidade de movimentos (pares de cartas viradas)                                                                      |
| `resultado`  | Reservado para evolução futura; hoje sempre `"Vitoria"`                                                                 |

### Comportamento

- Novas partidas são **adicionadas** ao final, sem sobrescrever as anteriores.
- A página de histórico exibe as partidas da **mais recente para a mais antiga**.
- **Limpar histórico** abre um diálogo de confirmação. Somente o botão _Apagar tudo_ remove os dados; _Cancelar_ ou a tecla `Esc` mantêm os registros.
- Se o `localStorage` estiver indisponível (modo privado restrito, por exemplo) ou o conteúdo estiver corrompido, o jogo continua funcionando com os valores padrão, sem erros.
- Os dados ficam **somente no navegador** em uso e são específicos da origem (`localhost:8000` e `localhost:5500`, por exemplo, têm armazenamentos separados).

Para inspecionar ou apagar manualmente: DevTools → _Application_ → _Local Storage_.

---

## Personagens

Os personagens ficam em `js/characters.js`:

| ID            | Nome       | Classe               |
| ------------- | ---------- | -------------------- |
| `warrior`     | Guerreiro  | Combatente           |
| `mage`        | Mago       | Arcanista            |
| `archer`      | Arqueira   | Patrulheira          |
| `knight`      | Cavaleiro  | Guardião             |
| `assassin`    | Assassino  | Sombra               |
| `druid`       | Druida     | Guardião da natureza |
| `paladin`     | Paladina   | Protetora            |
| `necromancer` | Necromante | Invocador            |

### Adicionar ou remover personagens

1. Coloque a imagem PNG em `imgs/characters/`.
2. Abra `js/characters.js` e adicione um objeto ao array `characters`:

```javascript
{
  id: "ranger",
  name: "Patrulheiro",
  className: "Explorador",
  image: "imgs/characters/ranger.png",
  fallback: "🏹"
}
```

- O `id` deve ser **único**.
- O caminho em `image` é sempre **relativo à raiz do projeto**. A função `getImageUrl()` o resolve corretamente em qualquer página, inclusive nas que ficam em `pages/`.
- Imagens idealmente são quadradas, com fundo transparente e estilo pixel art (a renderização usa `image-rendering: pixelated`).
- Se a imagem não existir ou falhar ao carregar, o jogo exibe o **emoji de `fallback`**.

> **Importante:** a dificuldade usa os primeiros _N_ personagens do array. Mantenha **pelo menos 8** cadastrados para que todas as dificuldades funcionem.

---

## Configurações e dificuldade

| Nível       | Valor interno | Pares | Cartas |
| ----------- | ------------- | ----- | ------ |
| Aprendiz    | `easy`        | 4     | 8      |
| Aventureiro | `normal`      | 6     | 12     |
| Lenda       | `hard`        | 8     | 16     |

- As configurações são **salvas assim que alteradas** e aplicadas na **próxima partida**.
- **Efeitos sonoros:** nesta versão existe apenas o controle visual. Nenhum áudio é reproduzido; o valor já é persistido para uso futuro.

---

## Identidade visual e responsividade

### Tema medieval/RPG

Todo o estilo está em `css/style.css` e é compartilhado entre as páginas.

| Elemento               | Valor                                |
| ---------------------- | ------------------------------------ |
| Fundo                  | `#17130f` com gradiente radial âmbar |
| Painéis                | `#211b15`, `#251e17`, `#2b2118`      |
| Dourado (destaque)     | `#d6ad63` / `#f0d49a`                |
| Verde (par encontrado) | `#7e9b70`                            |
| Texto / secundário     | `#eee4d2` / `#a99b85`                |
| Títulos                | **MedievalSharp** (Google Fonts)     |
| Texto                  | **Roboto Mono** (Google Fonts)       |

As cores principais estão definidas como variáveis CSS em `:root`.

### Responsividade

- **Até 600 px:** topbar compacta, estatísticas e tabuleiro com espaçamento reduzido, configurações em coluna e tabela do histórico com fonte menor.
- **Até 370 px:** tabuleiro passa de 4 para 3 colunas.
- Sem rolagem horizontal em telas de 375 px.

---

## Vídeo de fundo

O vídeo `imgs/interface/cards.mp4` é usado **exclusivamente** em `index.html`.

- Atributos: `autoplay`, `muted`, `loop`, `playsinline`.
- Estilo: `position: fixed`, ocupando toda a tela, com `object-fit: cover` (sem distorção).
- Uma camada escura em degradê (`.bg-video-overlay`) garante a legibilidade do menu.
- O vídeo e a camada têm `pointer-events: none`, então **não interferem** em cliques ou navegação.
- É decorativo (`aria-hidden="true"`).

> O vídeo precisa estar **mudo** para o `autoplay` funcionar nos navegadores. Se for trocado, mantenha codec **H.264** (MP4) para compatibilidade ampla. Arquivos grandes aumentam o tempo de carregamento do menu.

---

## Guia de manutenção

### Adicionar um novo nível de dificuldade

1. Em `js/game.js`, acrescente a entrada em `difficultyPairs` (por exemplo, `insane: 10`).
2. Em `pages/configuracoes.html`, adicione a `<option value="insane">` correspondente.
3. Cadastre personagens suficientes em `characters.js`.

### Adicionar uma nova página

1. Crie o `.html` em `pages/`, copiando o cabeçalho de uma página existente (as páginas internas usam `../css/style.css`).
2. Se precisar de lógica, crie `js/pages/<nome>-page.js` e carregue com `<script type="module" src="../js/pages/<nome>-page.js">`.
3. Use `class="screen content-screen active"` na seção principal para reaproveitar os estilos.
4. Adicione o link no menu em `index.html`.

### Registrar mais informações no histórico

Inclua o novo campo no objeto criado em `registerMatch` (`js/history.js`) e adicione a coluna correspondente em `pages/history.html` e `createRow` (`js/pages/history-page.js`). Registros antigos não terão o novo campo, então trate o valor ausente na exibição.

### Alterar tempos e animações

- Tempo de exibição de um par errado: `850` (ms) em `js/game.js`.
- Velocidade da virada de carta: `transition` de `.card-inner` em `css/style.css`.

---

## Solução de problemas

| Sintoma                                      | Causa provável                                                  | Solução                                                                        |
| -------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Tela sem interação / erro de CORS no console | Abriu via `file://`                                             | Use um servidor local (veja [Como executar](#como-executar))                   |
| Imagens dos personagens aparecem como emoji  | Arquivo ausente ou nome diferente do cadastro                   | Confira o nome do PNG em `imgs/characters/` e o campo `image`                  |
| Vídeo não aparece no menu                    | Arquivo ausente, codec não suportado ou economia de dados ativa | Verifique `imgs/interface/cards.mp4` e o codec H.264                           |
| Histórico não salva                          | `localStorage` bloqueado ou partida não concluída               | Verifique modo privado/bloqueio de cookies; só partidas finalizadas são salvas |
| Histórico "sumiu" ao trocar de endereço      | `localStorage` é separado por origem                            | Use sempre o mesmo endereço/porta                                              |
| Fontes diferentes do original                | Sem acesso ao Google Fonts                                      | Conecte-se à internet                                                          |

---

## Tecnologias

- **HTML5** — semântica, `<dialog>` para a confirmação de limpeza, `<video>` para o fundo.
- **CSS3** — variáveis, Grid, Flexbox, transformações 3D nas cartas, media queries.
- **JavaScript (ES Modules)** — sem bibliotecas externas.
- **Web Storage API** (`localStorage`) — configurações e histórico.

---

_Feito para aventureiros • Eldoria © 2026_
