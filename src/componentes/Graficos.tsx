import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View } from 'react-native';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 0.81; // Calcula 90% da largura da tela

const Graficos = ({ labels, data, quantidade }) => {
  // Limitar os dados para que o valor máximo seja 100
  const limitedData = data.map(value => (value > 100 ? 100 : value));
  const formattedLabels = labels.map(date => moment(date).format('DD/MM/YYYY'));

  // Selecionar os últimos 7 elementos
  const recentData = limitedData.slice(-quantidade);
  const recentLabels = formattedLabels.slice(-quantidade);

  return (
    <View>
      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: recentData,
            },
          ],
        }}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        fromNumber={100}
        fromZero
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(251, 172, 226, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#fbace2',
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
    </View>
  );
};

export default Graficos;
