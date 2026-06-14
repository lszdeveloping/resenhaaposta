# Resenha Aposta 🎲

Site responsivo para gerenciar apostas entre amigos e gerar ranking automático. Sem dinheiro real — controle interno entre amigos.

**Stack:** React + Vite · Tailwind CSS · Supabase · pronto para deploy na Vercel.

## Funcionalidades

- **Dashboard** — total apostado, total pago, total pendente, maior ganhador/perdedor, nº de apostas.
- **Amigos** — cadastro (nome, apelido, ativo/inativo), editar, excluir.
- **Apostas** — título, descrição, data, valor, participantes, palpites, resultado, status (aberta/finalizada/cancelada), observações.
- **Computar resultado** — selecionar vencedores/perdedores, valores manuais, gera movimentações.
- **Ranking** — total ganho/perdido, saldo, vitórias/derrotas, taxa de vitória, ordenado por saldo.
- **Histórico** — apostas finalizadas com filtros por amigo, data e status.
- **Financeiro individual** — saldo, ganhos, perdas, apostas, pagamentos, pendente a receber/pagar.

## Estrutura

```
src/
  api/         # camada de dados (Supabase): friends, bets, ranking, transactions, stats
  components/  # Layout, Sidebar, Modal, StatCard, BetForm, SettleBet, BetCard, Icons, ui
  lib/         # supabase client + helpers de formatação
  pages/       # Dashboard, Friends, FriendDetail, Bets, Ranking, History
supabase/
  schema.sql   # tabelas, view de ranking e políticas RLS
```

## 1. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor** e cole/execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   - Cria as tabelas `friends`, `bets`, `bet_participants`, `transactions`, `payments`, a view `ranking` e políticas RLS para a chave pública (`anon`).
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.

## 2. Rodar localmente

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
```

Preencha o `.env`:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-publica
```

```bash
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

## 3. Deploy na Vercel

1. Suba o repositório no GitHub.
2. Em [vercel.com](https://vercel.com) → **Add New → Project** → importe o repo.
3. A Vercel detecta Vite automaticamente (`vercel.json` já configurado: build `npm run build`, output `dist`, SPA rewrites).
4. Em **Settings → Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy**. Atualizações no branch principal fazem redeploy automático.

> A `anon key` é pública por design (protegida por RLS). Para uso mais restrito, troque as políticas em `schema.sql` por regras baseadas em `auth.uid()` e adicione login do Supabase Auth.

## Observações

- Valores computados manualmente no site; não integra casas de aposta nem pagamentos reais.
- Ao finalizar uma aposta, as movimentações (`transactions`) são regeneradas — finalizar de novo é idempotente.
- Tema escuro, responsivo (mobile e desktop), validações e tratamento de erros básicos inclusos.
