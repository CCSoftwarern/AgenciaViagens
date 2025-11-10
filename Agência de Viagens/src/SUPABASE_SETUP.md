# 🚀 Configuração do Supabase - ViagemPlus

## Passo 1: Criar Usuário Administrador

Para acessar o dashboard administrativo, você precisa criar um usuário no Supabase:

### Opção A: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Clique em **Authentication** no menu lateral
4. Clique em **Users**
5. Clique no botão **Add User** (ou "Invite")
6. Preencha:
   - **Email**: seu email (ex: admin@viagemplus.com)
   - **Password**: crie uma senha segura
   - **Auto Confirm User**: ✅ Marque esta opção
7. Clique em **Create User**

### Opção B: Via SQL Editor

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Clique em **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Cole o seguinte código:

```sql
-- Criar usuário admin
SELECT 
  id, 
  email, 
  created_at
FROM 
  auth.users
WHERE 
  email = 'admin@viagemplus.com';

-- Se não existir, você precisará criar via interface ou API
```

## Passo 2: Fazer Login

1. No site, clique no ícone 🛡️ azul no canto inferior direito
2. Use o email e senha que você criou
3. Você será redirecionado para o dashboard

## Passo 3: Carregar Dados Iniciais

Quando acessar o dashboard pela primeira vez:

1. Na página inicial do Dashboard, você verá um card "Carregar Dados Iniciais"
2. Clique no botão **"Carregar Dados"**
3. Isso irá popular o banco de dados com:
   - 6 promoções de exemplo
   - 6 serviços de exemplo

## Funcionalidades Disponíveis

### ✅ Gerenciar Promoções
- Adicionar novas promoções
- Editar promoções existentes
- Deletar promoções
- Campos: destino, título, duração, preço antigo/novo, desconto, avaliação, URL da imagem

### ✅ Gerenciar Serviços
- Adicionar novos serviços
- Editar serviços existentes
- Deletar serviços
- Campos: ícone, título, descrição

### ✅ Dashboard com Estatísticas
- Visualizar total de promoções e serviços
- Acompanhar atividades recentes
- Ver destinos mais procurados

## Estrutura do Banco de Dados

O sistema usa a tabela `kv_store_0c7f2afa` do Supabase com as seguintes chaves:

- `promotion:{id}` - Dados das promoções
- `service:{id}` - Dados dos serviços
- `contact:{id}` - Formulários de contato recebidos

## Autenticação

- ✅ Login via Supabase Auth
- ✅ Proteção de rotas administrativas
- ✅ Token JWT armazenado no localStorage
- ✅ Logout automático ao fechar o dashboard

## Troubleshooting

### "Unauthorized" ao tentar criar/editar
- Verifique se você está logado
- Tente fazer logout e login novamente
- Certifique-se de que o usuário foi criado corretamente no Supabase

### Dados não aparecem no site
- Clique em "Carregar Dados Iniciais" no dashboard
- Verifique se as promoções/serviços foram criadas corretamente
- Recarregue a página do site

### Erro ao fazer login
- Verifique se o email e senha estão corretos
- Certifique-se de que o usuário foi confirmado (Auto Confirm marcado)
- Verifique os logs no Supabase Dashboard > Logs

## Suporte

Para mais informações sobre o Supabase:
- [Documentação do Supabase](https://supabase.com/docs)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
