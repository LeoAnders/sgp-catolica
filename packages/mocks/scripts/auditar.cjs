/**
 * Executa a auditoria de coerencia dos mocks e devolve codigo de saida 1 quando
 * encontra alguma contradicao, para poder ser usada em verificacao automatizada.
 *
 * Le a versao ja compilada por tsconfig.audit.json: assim o Node roda o mesmo
 * dado que as telas consomem, sem precisar de runner de teste ou transpilador.
 */
const { auditarMocks } = require('../dist/auditoria.js');

const { verificacoes, falhas } = auditarMocks();

if (falhas.length === 0) {
  console.log(`Auditoria dos mocks: ${verificacoes} verificacoes, nenhuma contradicao.`);
  process.exit(0);
}

console.error(`Auditoria dos mocks: ${verificacoes} verificacoes, ${falhas.length} falha(s).`);
for (const falha of falhas) {
  console.error(`  x ${falha}`);
}
process.exit(1);
