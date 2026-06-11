# Reserva de Vagas - Postos Afiliados

Aplicativo em Next.js (App Router) com TypeScript e Tailwind CSS para simular reserva de vagas em postos afiliados.

## Funcionalidades

- Listagem de postos afiliados em cards.
- Modal de seleção com status de disponibilidade e vagas restantes.
- Fluxo de reserva com validação de placa, nome/responsável, telefone, horário e tamanho do caminhão.
- Switch de frota para reservar múltiplas vagas com responsável.
- Desconto automático das vagas disponíveis após cada reserva.
- Tela de gestão (`/gestao`) para reserva manual de vagas.
- Popup de sucesso com código de validação da vaga.

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Rode em modo de desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador:

```bash
http://localhost:3000
```
