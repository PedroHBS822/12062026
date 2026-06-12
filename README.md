# ✨ A Câmera de Lembranças

Site-presente interativo para a Gabriela: 6 fases com enigmas e senhas,
animações mágicas em roxo e verde, e um grande final com uma galeria viva
de 900+ fotos.

É um site 100% estático (HTML + CSS + JS puro) — não precisa de servidor,
banco de dados nem build. Basta hospedar esta pasta.

## Como testar agora

Abra o `index.html` no navegador, ou rode um servidor local:

```bash
cd docs
python3 -m http.server 8000
# abra http://localhost:8000
```

Atalhos úteis para testar (não conte para ela 😄):

- `?fase=3` na URL pula direto para a fase 3 (1 a 6).
- `?reiniciar` apaga o progresso salvo e volta para o começo.
- O progresso fica salvo no navegador: se ela fechar a aba, volta de onde parou.

## As senhas

| Fase | Senha | Observação |
|------|-------|------------|
| 1 — A Luz Escura | `22072022` | aceita com ou sem pontos/barras |
| 2 — O Primeiro Beijo | `Linda` | aceita maiúsculas/minúsculas e acentos |
| 3 — A Linha do Tempo | `batman` | aceita `Batman` também |
| 4 — A Admiração | `09:40` | aceita `0940`, `9:40`, `9h40`… |
| 5 — A Base do Castelo | `20190173` | |
| 6 — O Futuro | botão "Clique Aqui" | ele foge 3 vezes antes de deixar clicar 😈 |

## As 900+ fotos (Google Drive)

Sim, dá para usar o Google Drive! O site monta a URL de miniatura do Drive
(`https://drive.google.com/thumbnail?id=...&sz=w600`) a partir do ID de cada
arquivo. Para isso, cada foto precisa estar compartilhada como "qualquer
pessoa com o link pode ver" — o script abaixo já faz isso por você.

### Passo a passo

1. Coloque todas as fotos em **uma pasta** no seu Google Drive.
2. Siga as instruções no topo de [`tools/exportar-fotos.gs`](tools/exportar-fotos.gs)
   (cola o script em https://script.google.com e executa). Ele percorre a
   pasta, libera o compartilhamento por link e gera um arquivo `photos.js`
   na raiz do seu Drive com a lista dos 900+ IDs.
3. Copie a constante `DRIVE_PHOTO_IDS` gerada para dentro de
   [`js/photos.js`](js/photos.js), substituindo a lista vazia.

Enquanto a lista estiver vazia, o site mostra fotos de demonstração
(quadradinhos coloridos) para você poder testar tudo.

### Como o site aguenta 900 fotos

A galeria não carrega as 900 de uma vez: ficam ~20 molduras flutuando na
tela e, a cada poucos segundos, uma delas troca de foto sozinha, percorrendo
a coleção inteira embaralhada. As imagens são carregadas como miniaturas
(400px) sob demanda, e só ao clicar numa foto é carregada a versão grande
(1200px). Clicar numa foto abre em tela cheia, com setas para navegar.

> Observação: o endpoint de miniaturas do Drive é o jeito mais estável de
> exibir imagens do Drive em sites, mas o Google pode limitar acessos em
> rajada. Se um dia alguma foto não carregar, o site tenta automaticamente
> um endereço alternativo (CDN `lh3.googleusercontent.com`). Se quiser algo
> 100% garantido no futuro, a alternativa é subir as fotos junto com o site
> (ex.: pasta `fotos/` no GitHub Pages) — a estrutura já está pronta para
> trocar só o `photos.js`.

## Como publicar (GitHub Pages)

1. No GitHub, vá em **Settings → Pages**.
2. Em "Build and deployment", escolha **Deploy from a branch**,
   branch `main` (após o merge) e pasta **`/docs`**.
3. O site fica no ar em `https://SEU_USUARIO.github.io/Claudio/`.

Qualquer hospedagem estática também funciona (Netlify, Vercel, Cloudflare
Pages): basta apontar para a pasta `docs/`.

## Estrutura

```
docs/
├── index.html          # estrutura da página
├── css/style.css       # todo o visual e as animações
├── js/app.js           # as 6 fases, enigmas, senhas e o grande final
├── js/gallery.js       # a galeria viva de fotos flutuantes
├── js/particles.js     # vaga-lumes de fundo e brilhos do cursor
├── js/photos.js        # ⬅ cole aqui os IDs das fotos do Drive
└── tools/exportar-fotos.gs  # script que gera a lista de IDs
```
