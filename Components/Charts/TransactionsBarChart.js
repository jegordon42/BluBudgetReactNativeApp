import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, FlatList, StyleSheet, StatusBar } from 'react-native'
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import * as constants from '../../Constants'
import * as chartData from './GetChartData'  
const SCREEN_WIDTH = Dimensions.get("screen").width - 20;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

function TransactionsBarChart() {
    const transactions = useSelector(state => state.filters.type === 'Expenses' ? state.filteredExpenseTransactions : state.filteredIncomeTransactions)
    const filters = useSelector(state => state.filters)
  
    return (
      <View>
            <BarChart
                data={chartData.getBarChartData(filters, transactions)}
                style={{paddingRight:10}}
                width={SCREEN_WIDTH}
                height={SCREEN_HEIGHT * 2/7}
                showValuesOnTopOfBars
                withHorizontalLabels={false}
                chartConfig={{
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  fillShadowGradient: constants.colors.primaryColor,
                  fillShadowGradientOpacity: 1,
                  color: ()=>constants.colors.primaryColor,
                  barPercentage: 0.75,
                  propsForBackgroundLines: {stroke:"white"},
                  decimalPlaces:2,
                  useShadowColorFromDataset: false, // optional
                  propsForVerticalLabels:{textAnchor:'middle'}
                }}
                xLabelsOffset={0}
                verticalLabelRotation={10}
            />
      </View>
    );
  }
  
  export default TransactionsBarChart;