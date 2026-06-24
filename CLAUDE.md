# GestaoEventos — guia para o assistente

App pessoal de gestão de eventos (grupos, famílias, eventos).
**Sem build, sem npm.** Site estático (GitHub Pages), PWA, + **Supabase (REST)** (com `localStorage` para cache local).

## Estrutura
- `index.html` — **ficheiro único** (~1358 linhas): markup + CSS + JS tudo dentro. (Ainda NÃO dividido como o SplitBill/FestasBV.)
- `sw.js` — service worker (cache PWA).
- Não mexer: ícones, `manifest.json`.

## Como NÃO gastar tokens à toa
- Lê só o troço relevante do `index.html`, não o ficheiro todo. Para localizar um botão/campo, procura o `id` no markup e salta para o handler no `<script>`.
- Faz **edições cirúrgicas** (diffs pequenos). **Nunca reescrevas o ficheiro inteiro.**
- Se isto crescer, vale a pena dividir em `index.html` + `app.js` + `style.css` (como já fiz no SplitBill e FestasBV).

## Regras técnicas (não partir a app)
- O JS está inline e há handlers `onclick="…"` → as funções têm de ser **globais**. Se algum dia extraíres para `app.js`, carrega-o como `<script src>` normal (NÃO module).
- **PWA/cache:** se alterares o HTML/CSS/JS, **sobe a versão do CACHE no `sw.js`**.
- **Supabase:** schema `gestaoeventos` (tabelas `grupos`, `familias`, `eventos`, `config`, `allowed_users`, `access_requests`). A chave (`SB_SCHEMA`/`SB_KEY` no `<script>`) é a **`anon` (pública por design)**, protegida por RLS + login Google. **Não é bug nem risco — não a "corrijas".**

## Deploy
GitHub Pages a partir de `main`. Um push para `main` publica.
