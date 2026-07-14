# 🌾 Farm Delivery

---

## 1. Identificação do aluno

| Campo        | Valor                     |
| ------------ | ------------------------- |
| **Nome**     | Rúben Oliveira Benedito   |
| **Nº aluno** | 32184                     |

---

## 2. Enquadramento da entrega

Esta submissão corresponde à **época de recurso** do ano letivo 2025/2026 e representa o trabalho individual desenvolvido para a unidade curricular de Tecnologias e Multimédia, referente à parte prática, relativa ao jogo 2, desenvolvido em Phaser.

---

## 3. Tecnologias

| Tecnologia | Versão | Como foi incluída |
|------------|--------|-------------------|
| Phaser | 3.80 | npm (importado em main.js) |
| Vue | 3.5.39 | npm (menus, HUD, lojas, campos) |
| Vite | 8.1.1 | npm (dev-server e build) |
| Tiled | — | Mapa criado e exportado em JSON |

---

## 4. Género e Objetivo

**Género:** Simulador agrícola 2D top‑down.  
**Objetivo:** Plantar, colher e vender produtos para cumprir pedidos e aumentar o lucro.

---

## 5. Regras principais

O jogo segue um conjunto de regras simples que definem o ciclo de progressão do jogador:

- Inventário inicial limitado de sementes.  
- Cada cultura tem um ciclo de crescimento (plantar → crescer → colher).  
- Pedidos de clientes surgem automaticamente com quantidade e preço variável.  
- O jogador começa com um total de 50 moedas.  
- A música de fundo só inicia após a primeira interação do jogador.

---

## 6. Funcionalidades implementadas

O jogo inclui todas as funcionalidades essenciais para um simulador agrícola simples:

- Campos agrícolas interativos (plantar, crescer, colher).  
- Lojas de sementes, upgrades e celeiro.  
- Sistema de pedidos de clientes com recompensas.  
- HUD com dinheiro e inventário.  
- Menus Vue sobrepostos ao jogo.  
- Idiomas disponíveis: PT / EN / FR.  
- Reinício completo do jogo (reset total do estado).  
- Colisões do mapa configuradas via Tiled.

---

## 7. Controlos

| Tecla | Ação |
|-------|------|
| W / A / S / D | Mover o jogador |
| F | Interagir (lojas, celeiro, campos) |
| ESC | Abrir / fechar o menu de pausa |

---

## 8. Como executar

npm install  
npm run dev  
Abrir o endereço indicado pelo Vite.

---

## 9. Aspetos multimédia

### Formatos usados

| Tipo | Formato | Justificação |
|------|---------|--------------|
| Imagens | PNG | Qualidade e compatibilidade |
| Spritesheets | PNG | Suporte nativo do Phaser |
| Música | MP3 | Ideal para loops |
| Efeitos | WAV | Baixa latência |

### Origem dos assets

- Tileset: Summer Outdoors Tilesheet (CC0)  
- Sons ambiente: Pixabay / Freesound  
- Sprites do jogador: CC0 / próprios  

### Resolução / Tamanho

| Asset | Tamanho |
|-------|---------|
| Tileset | 16×16 |
| Sprites do jogador | 32×32 |
| Música ambiente | ~200 KB |
| Efeitos | < 50 KB |

---


## 10. Estrutura do projeto

```
farm-delivery/
├── index.html               # ponto de entrada (carrega src/main.js como módulo)
├── package.json             # Phaser 4.2 · Vue 3.5 · Vite 8
├── vite.config.js
├── README.md                # este ficheiro
│
├── public/
│   ├── assets/              # mapa + edifícios + tilset + spritesheet do player
│   ├── items/               # 8 ícones de produtos (.png)
│   ├── sound/               # effect.wav + som_fundo.mp3
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── main.js              # bootstrap Phaser + Vue + sistema de música
    ├── scenes/              # LoadingScene · GameScene · MenuScene
    ├── player/              # config · animações · movimento
    ├── objects/             # Barn · SeedShop · StoneCabin · UpgradeShop · Interactable
    ├── fields/              # Field · fields.js · fieldGrowth
    ├── items/               # products.js (catálogo de 8 produtos)
    ├── ui/                  # gameHud · counter
    ├── i18n/                # dicionários PT · EN · FR
    └── components/          # menus Vue (GameMenu · BarnMenu · FieldMenu · ...)
```

---
