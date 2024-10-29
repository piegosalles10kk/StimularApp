// Graficos.js
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 0.9; // Calcula 90% da largura da tela

const Graficos = ({ labels, data }) => {
  return (
    <View>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#f6c1c8',
          backgroundGradientTo: '#fbace2',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
          marginVertical: 8,
          borderRadius: 20,
          alignSelf: 'center',
          
        }}
      />
    </View>
  );
};

export default Graficos;
