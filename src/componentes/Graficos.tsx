import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 0.81; // Calcula 81% da largura da tela

const Graficos = ({ labels, dataSets, quantidade }) => {
  // Limitar os dados para que o valor máximo seja 100
  const limitedDataSets = dataSets.map(data =>
    data.map(value => (value > 100 ? 100 : value)).slice(-quantidade)
  );

  // Cores para cada tipo de atividade
  const colors = [
    `rgb(255, 208, 0)`, // socializacao
    `rgba(255, 99, 132, 1)`,  // cognicao
    `rgba(54, 162, 235, 1)`,  // linguagem
    `rgba(75, 192, 192, 1)`,  // autoCuidado
    `rgba(153, 102, 255, 1)`   // motor
  ];

  const tiposAtividade = ['socializacao', 'cognicao', 'linguagem', 'autoCuidado', 'motor'];

  const tipoCorreto = {
    'socializacao': 'Socialização',
    'cognicao': 'Cognição',
    'linguagem': 'Linguagem',
    'autoCuidado': 'Auto-Cuidado',
    'motor': 'Motor',
  };

  return (
    <View>
      <LineChart
        data={{
          labels: [], // Removemos as labels para não aparecer no X
          datasets: limitedDataSets.map((data, index) => ({
            data: data,
            color: (opacity = 1) => colors[index], // Define a cor para cada conjunto
            strokeWidth: 2,
          })),
        }}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        fromZero
        fromNumber={100}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,  // Cor padrão do gráfico
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '1',
            stroke: '#fff',
          },
        }}
        bezier
        style={{
          marginTop: 10,
          marginVertical: 8,
          borderWidth: 2,
          alignSelf: 'center',
        }}
      />

      {/* Componente de Legenda */}
      <View style={styles.legendContainer}>
        {tiposAtividade.map((tipo, index) => (
          <View key={tipo} style={styles.legendItem}>
            <View style={[styles.colorCircle, { backgroundColor: colors[index] }, { marginLeft: 5}]} />
            <Text style={{ fontSize: 9}}>{tipoCorreto[tipo]}</Text> {/* Usando tipoCorreto para obter o texto formatado */}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorCircle: {
    width: 5,
    height: 10,
    borderRadius: 5, // Faz o círculo
    marginRight: 5,
  },
});

export default Graficos;
