import { turmasMock } from '@sgp/mocks';
import { Cartao } from './components/Cartao';

/**
 * Ponto de partida da aplicacao web.
 *
 * As telas do sistema ainda serao construidas; esta tela existe para validar o
 * ambiente (build, tokens de design e consumo dos pacotes compartilhados).
 */
export function App() {
  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: 'var(--espaco-xl)' }}>
      <h1 style={{ fontSize: 'var(--fonte-xxl)', marginBottom: 'var(--espaco-xs)' }}>
        SGP Catolica
      </h1>
      <p style={{ color: 'var(--cor-texto-secundario)', marginTop: 0 }}>
        Sistema de Geracao de Provas. Ambiente configurado; telas em construcao.
      </p>

      <Cartao titulo="Dados de exemplo carregados do pacote de mocks">
        <ul>
          {turmasMock.map((turma) => (
            <li key={turma.id}>
              {turma.name} — {turma.subject} ({turma.term})
            </li>
          ))}
        </ul>
      </Cartao>
    </main>
  );
}
