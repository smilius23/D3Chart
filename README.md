# D3 Bar Chart with scroll

This Chart was made with JavaScript and D3 4v.

In to your html add D3 library:  `<script src="https://d3js.org/d3.v4.min.js"></script>`

and create div container where will be loading chart: `<div id="chartContainer"></div>`

On the end add ling to js: `<script src="barChart.js"></script>`

load chart rendering: `loadChart(someData, 'chartContainer');`

Structure of given data should be array:

```
someData = [
  {
    name: 'first',
    value: 1
  },{
    name: 'second',
    value: 2
  }
]
```
