alter table public.apolices
  add column if not exists metodo_pagamento text,
  add column if not exists quantidade_parcelas integer,
  add column if not exists primeiro_vencimento date;

alter table public.apolices
  drop constraint if exists apolices_metodo_pagamento_check,
  add constraint apolices_metodo_pagamento_check
    check (metodo_pagamento is null or metodo_pagamento in ('À vista', 'Parcelado')),
  drop constraint if exists apolices_quantidade_parcelas_check,
  add constraint apolices_quantidade_parcelas_check
    check (quantidade_parcelas is null or quantidade_parcelas between 1 and 60);

create table if not exists public.apolice_pagamentos (
  id uuid primary key default gen_random_uuid(),
  apolice_id uuid not null references public.apolices(id) on delete cascade,
  numero_parcela integer not null,
  quantidade_parcelas integer not null,
  valor numeric(14,2) not null check (valor >= 0),
  data_vencimento date not null,
  data_pagamento date,
  status text not null default 'Pendente' check (status in ('Pendente', 'Pago')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (apolice_id, numero_parcela)
);

create index if not exists apolice_pagamentos_apolice_id_idx
  on public.apolice_pagamentos(apolice_id);

create index if not exists apolice_pagamentos_vencimento_status_idx
  on public.apolice_pagamentos(data_vencimento, status);

alter table public.apolice_pagamentos enable row level security;

drop policy if exists "Usuários autenticados gerenciam pagamentos de apólices"
  on public.apolice_pagamentos;

create policy "Usuários autenticados gerenciam pagamentos de apólices"
  on public.apolice_pagamentos
  for all
  to authenticated
  using (true)
  with check (true);
