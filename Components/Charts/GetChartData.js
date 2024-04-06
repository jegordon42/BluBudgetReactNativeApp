const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getBarChartDataByDay(startDate, endDate, transactions){
  var labels = []
  var data = []
  for(var curDate = startDate; curDate <= endDate; curDate.setDate(curDate.getDate() + 1)){
    labels.push(curDate.getMonth() + 1 + '/' + curDate.getDate())
    data.push(0)
  }
  for(var i = 0; i < transactions.length; i++){
    var curDate = transactions[i]['Date']
    var day = Number(curDate.substring(curDate.indexOf('/') + 1, curDate.indexOf('/', curDate.indexOf('/') + 1)))
    var month = Number(curDate.substring(0, curDate.indexOf('/')))
    curDate = month + '/' + day
    var index = labels.indexOf(curDate)
    if(index != -1)
      data[index] += Number(transactions[i]['Amount'])
  }

  var formattedData = []
  data.forEach((amount) => formattedData.push(amount.toFixed(2).toString()))

  var datasets = [{
    data: formattedData
  }]
  return {
    labels: labels,
    datasets: datasets
  }
}

function getBarChartDataByWeek(startDate, endDate, transactions){
  var labels = []
  var dateRanges = []
  var data = []
  for(var curDate = startDate; curDate <= endDate;){
    var nextDate =  new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 6)
    if(nextDate > endDate)
      nextDate = endDate;
    labels.push((curDate.getMonth() + 1).toString() + "/" + curDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "/" + nextDate.getDate().toString())
    dateRanges.push([curDate, nextDate])
    data.push(0)
    curDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 7);
  }
  for(var i = 0; i < transactions.length; i++){
    var curDate = new Date(transactions[i]['Date'])
    for(var index = 0; index < dateRanges.length; index++){
      if(curDate >= dateRanges[index][0] && curDate <= dateRanges[index][1]){
        data[index] += Number(transactions[i]['Amount']);
        break;
      }
    }
  }

  var formattedData = []
  data.forEach((amount) => formattedData.push(amount.toFixed(2).toString()))

  var datasets = [{
    data: formattedData
  }]
  
  return {
    labels: labels,
    datasets: datasets
  }
}

function getBarChartDataByMonth(startDate, endDate, transactions, monthIncrement){
  var labels = []
  var dateRanges = []
  var data = []
  for(var curDate = startDate; curDate <= endDate;){
    var nextDate =  new Date(curDate.getFullYear(), curDate.getMonth() + monthIncrement, 1)
    nextDate.setDate(nextDate.getDate() - 1)

    var isLastDate = false;
    if(nextDate > endDate){
      nextDate = endDate;
      isLastDate = true
    }
    
    if(curDate.getDate() == 1 && !isLastDate){
      if(monthIncrement == 1)
        labels.push(monthNames[curDate.getMonth()])
      else
        labels.push(monthNames[curDate.getMonth()] + '-' + monthNames[nextDate.getMonth()])
    }
    else
      labels.push((curDate.getMonth() + 1).toString() + "/" + curDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "/" + nextDate.getDate().toString())
    
    dateRanges.push([curDate, nextDate])
    data.push(0)
    curDate = new Date(curDate.getFullYear(), curDate.getMonth() + monthIncrement, 1)
  }
  for(var i = 0; i < transactions.length; i++){
    var curDate = new Date(transactions[i]['Date'])
    for(var index = 0; index < dateRanges.length; index++){
      if(curDate >= dateRanges[index][0] && curDate <= dateRanges[index][1]){
        data[index] += Number(transactions[i]['Amount']);
        break;
      }
    }
  }

  var formattedData = []
  data.forEach((amount) => formattedData.push(amount.toFixed(2).toString()))

  var datasets = [{
    data: formattedData
  }]
  
  return {
    labels: labels,
    datasets: datasets
  }
}

function getBarChartDataByYear(startDate, endDate, transactions){
  var labels = []
  var dateRanges = []
  var data = []
  for(var curDate = startDate; curDate <= endDate;){
    var nextDate =  new Date(curDate.getFullYear() + 1, 0, 1)
    nextDate.setDate(nextDate.getDate() - 1)

    var isLastDate = false;
    if(nextDate > endDate){
      nextDate = endDate;
      isLastDate = true
    }
    
    if(curDate.getDate() == 1 && curDate.getMonth() == 0 && !isLastDate)
        labels.push(curDate.getFullYear())
    else
      labels.push((curDate.getMonth() + 1).toString() + "/" + curDate.getDate().toString() + "-" + (nextDate.getMonth() + 1).toString() + "/" + nextDate.getDate().toString())
    
    dateRanges.push([curDate, nextDate])
    data.push(0)
    curDate = new Date(curDate.getFullYear() + 1, 0, 1)
  }
  for(var i = 0; i < transactions.length; i++){
    var curDate = new Date(transactions[i]['Date'])
    for(var index = 0; index < dateRanges.length; index++){
      if(curDate >= dateRanges[index][0] && curDate <= dateRanges[index][1]){
        data[index] += Number(transactions[i]['Amount']);
        break;
      }
    }
  }

  var formattedData = []
  data.forEach((amount) => formattedData.push(amount.toFixed(2).toString()))

  var datasets = [{
    data: formattedData
  }]
  
  return {
    labels: labels,
    datasets: datasets
  }
}


export function getBarChartData(filters, transactions){
  var startDate = new Date(filters.startDate.getFullYear(), filters.startDate.getMonth(), filters.startDate.getDate())
  var endDate = new Date(filters.endDate.getFullYear(), filters.endDate.getMonth(), filters.endDate.getDate())
  
  var numDaysInFilteredRange = Math.ceil((Math.abs(endDate - startDate)) / (1000 * 60 * 60 * 24)) + 1;
  if(numDaysInFilteredRange <= 7)//7 days or lower
    return getBarChartDataByDay(startDate, endDate, transactions)
  if(numDaysInFilteredRange <= 42)//6 weeks and lower
     return getBarChartDataByWeek(startDate, endDate, transactions)

  var numMonthsInFilteredRange = ((endDate.getFullYear() - startDate.getFullYear()) * 12) - startDate.getMonth() + endDate.getMonth() + 1
  if(numMonthsInFilteredRange <= 7)//7 months and lower
    return getBarChartDataByMonth(startDate, endDate, transactions, 1)
  if(numMonthsInFilteredRange <= 14)//14 months and lower
    return getBarChartDataByMonth(startDate, endDate, transactions, 2)
  if(numMonthsInFilteredRange <= 28)//7 quarters and lower
    return getBarChartDataByMonth(startDate, endDate, transactions, 4)
  if(numMonthsInFilteredRange <= 42)//7 halves and lower
    return getBarChartDataByMonth(startDate, endDate, transactions, 6)
  if(numMonthsInFilteredRange <= 84)//7 years and lower
    return getBarChartDataByYear(startDate, endDate, transactions)
}