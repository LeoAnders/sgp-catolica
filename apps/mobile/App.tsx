import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { cores, espacamento, raio, tipografia } from '@sgp/design-tokens';
import { aplicacoesMock } from '@sgp/mocks';

/**
 * Ponto de partida do aplicativo do professor.
 *
 * As telas de correcao ainda serao construidas; esta tela existe para validar o
 * ambiente (Expo, tokens de design e consumo dos pacotes compartilhados).
 */
export default function App() {
  return (
    <SafeAreaView style={estilos.tela}>
      <StatusBar style="dark" />
      <View style={estilos.conteudo}>
        <Text style={estilos.titulo}>SGP Catolica</Text>
        <Text style={estilos.subtitulo}>App do professor. Telas em construcao.</Text>

        <View style={estilos.cartao}>
          <Text style={estilos.cartaoTitulo}>Aplicacoes de exemplo</Text>
          {aplicacoesMock.map((aplicacao) => (
            <Text key={aplicacao.id} style={estilos.item}>
              {aplicacao.id} — {aplicacao.status}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundoAlternativo },
  conteudo: { padding: espacamento.lg, gap: espacamento.md },
  titulo: { fontSize: tipografia.tamanho.xxl, fontWeight: '700', color: cores.texto },
  subtitulo: { fontSize: tipografia.tamanho.sm, color: cores.textoSecundario },
  cartao: {
    backgroundColor: cores.superficie,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raio.lg,
    padding: espacamento.lg,
    gap: espacamento.xs,
  },
  cartaoTitulo: { fontSize: tipografia.tamanho.lg, fontWeight: '700', color: cores.texto },
  item: { fontSize: tipografia.tamanho.md, color: cores.textoSecundario },
});
