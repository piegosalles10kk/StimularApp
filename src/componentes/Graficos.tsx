import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, StyleSheet, Text } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 0.81;

const COLORS = [
  `rgb(255, 208, 0)`,  // socializacao
  `rgba(255, 99, 132, 1)`,  // cognicao
  `rgba(54, 162, 235, 1)`,  // linguagem
  `rgba(75, 192, 192, 1)`,  // autoCuidado
  `rgba(153, 102, 255, 1)`   // motor
];

const ACTIVITY_TYPES = {
  socializacao: 'Socialização',
  cognicao: 'Cognição',
  linguagem: 'Linguagem',
  autoCuidado: 'Auto-Cuidado',
  motor: 'Motor',
};

const limitDataValues = (data, max = 100) => 
  data.map(value => (value > max ? max : value));

const prepareDatasets = (dataSets, quantidade) =>
  dataSets.map(data => limitDataValues(data).slice(-quantidade));

const Graficos = ({ labels, dataSets, quantidade }) => {
  const limitedDataSets = prepareDatasets(dataSets, quantidade);

  const chartData = {
    labels: [], // Labels removidas para não aparecer no X
    datasets: limitedDataSets.map((data, index) => ({
      data,
      color: (opacity = 1) => COLORS[index],
      strokeWidth: 2,
    })),
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#fff',
    },
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        fromZero
        fromNumber={100}
        chartConfig={chartConfig}
        bezier
        style={styles.chartStyle}
      />
      <Legend />
    </View>
  );
};

const Legend = () => (
  <View style={styles.legendContainer}>
    {Object.entries(ACTIVITY_TYPES).map(([key, label], index) => (
      <View key={key} style={styles.legendItem}>
        <View style={[styles.colorCircle, { backgroundColor: COLORS[index] }]} />
        <Text style={styles.legendText}>{label}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  chartStyle: {
    marginTop: 10,
    marginVertical: 8,
    borderWidth: 2,
    alignSelf: 'center',
  },
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
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 9,
    color: 'black',
  },
});

export default Graficos;
