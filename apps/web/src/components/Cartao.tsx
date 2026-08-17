import type { ReactNode } from 'react';

interface CartaoProps {
  titulo: string;
  children: ReactNode;
}

export function Cartao({ titulo, children }: CartaoProps) {
  return (
    <section
      style={{
        background: 'var(--cor-superficie)',
        border: '1px solid var(--cor-borda)',
        borderRadius: 'var(--raio-lg)',
        boxShadow: 'var(--sombra-cartao)',
        padding: 'var(--espaco-lg)',
      }}
    >
      <h2 style={{ fontSize: 'var(--fonte-lg)', marginTop: 0 }}>{titulo}</h2>
      {children}
    </section>
  );
}
