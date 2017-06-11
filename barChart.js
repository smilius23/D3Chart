function loadChart(data, containerId){
  const settings = {
   color: {
     text: {
       axis: 'rgb(100, 100, 100)'
     },
     positive: {
       min: 'rgb(0, 200, 0)',
       max: 'rgb(0, 100, 0)'
     },
     negative: {
       min: 'rgb(255, 60, 60)',
       max: 'rgb(150, 30, 30)'
     }
   }
 };
  const showLayouts = true;
  const maxValue = d3.max(data, function(d){ return d.value; });
  const minValue = d3.min(data, function(d){ return d.value; });
  const scaleMaxValue = findMaxValue(maxValue, minValue);
  const
    totalWidth = 500,
    totalHeight = 300;
  const
    margins = {
      top: (3/100)*totalHeight,
      right: 0,
      bottom: (8/100)*totalHeight,
      left: 0
    };
  const
    leftGraphWidth =(90/100)*totalWidth, //90%
    leftGraphHeight = totalHeight; //100%
  const
    rightGraphWidth =(10/100)*totalWidth, //10%
    rightGraphHeight = totalHeight - margins.bottom; //90%

  const
    mainWidth = (85/100)*leftGraphWidth,
    mainHeight = leftGraphHeight - margins.top - margins.bottom,
    XAxisWidth = mainWidth,
    XAxisHeight = margins.bottom,
    YAxisWidth = (15/100)*leftGraphWidth,
    YAxisHeight = leftGraphHeight - margins.top - margins.bottom;

  const
    maxBarsNumberPerScreen = 10;

  let
    barPadding = 5,
    barWidth =20;

  dataSort(data);

  if (data.length > maxBarsNumberPerScreen){
     barPadding = (2/100)*leftGraphHeight; //2%
     barWidth = (8/100)*leftGraphHeight; //10%
   }

//--------------------- SVG --------------------------------------------------

  const svg = d3.select('#'+containerId).append('svg')
    .attr('width', totalWidth)
    .attr('height', totalHeight)

//--------------------- Left graph group ---------------------------------------
    const leftGraphGroup = svg
      .append('g')
      if(showLayouts){
        leftGraphGroup
          .append('g')
          .append('rect')
            .attr('width', leftGraphWidth)
            .attr('height', leftGraphHeight)
            .style('fill', 'rgba(200, 0, 100, 0.1)')
            .style('stroke', 'rgba(100, 100, 100, 0.1');
      }

 //--------------------- Base Graph Group --------------------------------------
    const mainGraphGroup = leftGraphGroup
      .append('g')
      .attr('transform', 'translate('+ YAxisWidth +', '+margins.top+')');
      if(showLayouts){
        mainGraphGroup
          .append('g')
          .append('rect')
            .attr('width', mainWidth)
            .attr('height', mainHeight)
            .style('fill', 'rgba(0, 200, 200, 0.1)')
            .style('stroke', 'rgba(100, 100, 100, 0.1');
      }

//--------------------- Y axis group ------------------------------------------
   const leftAxisGroup = leftGraphGroup
     .append('g')
     .attr('transform', 'translate(0, '+margins.top+')');
   if(showLayouts){
     leftAxisGroup
       .append('g')
       .append('rect')
           .attr('width', YAxisWidth)
           .attr('height', YAxisHeight)
           .style('fill', 'rgba(100, 0, 200, 0.1)')
           .style('stroke', 'rgba(100, 100, 100, 0.1');
     }
//--------------------- X axis group --------------------------------------------
   const bottomAxisGroup = leftGraphGroup
     .append('g')
     .attr('transform', 'translate('+ YAxisWidth +', '+ (mainHeight+margins.top) +')');
   if(showLayouts){
     bottomAxisGroup
       .append('g')
       .append('rect')
         .attr('width', XAxisWidth)
         .attr('height', XAxisHeight)
         .style('fill', 'rgba(200, 200, 0, 0.1)')
         .style('stroke', 'rgba(100, 100, 100, 0.1');
   }

//--------------------- Right graph group --------------------------------------
   const rightGraphGroup = svg
     .append('g')
     .attr('transform', 'translate('+leftGraphWidth+', 0)');
   if(showLayouts){
     rightGraphGroup
       .append('g')
       .append('rect')
         .attr('width', rightGraphWidth)
         .attr('height', rightGraphHeight)
         .style('fill', 'rgba(0, 200, 100, 0.2)')
         .style('stroke', 'rgba(100, 100, 100, 0.3');
   }

//------------------------------------------------------------------------------
//-------------------- Scales --------------------------------------------------

   const xScale = d3.scaleLinear()
     .domain([-scaleMaxValue, scaleMaxValue])
     .range([0, mainWidth])

   const xScaleForBrush = d3.scaleLinear()
     .domain([-scaleMaxValue, scaleMaxValue])
     .range([0, rightGraphWidth])
     //.nice()

     const listOfNames = data.map(d => {return d.name});
     const yScale = d3
       .scaleBand()
       .domain(listOfNames)
       .range([0, mainHeight])
       .paddingInner(0.3)

     const yScaleForBrush = d3
       .scaleBand()
       .domain(listOfNames)
       .range([0, (rightGraphHeight-margins.top)])
       .paddingInner(0.3)

     const colorScaleForPositiveValue = d3.scaleLinear()
       .domain([0, maxValue])
       .range([settings.color.positive.min, settings.color.positive.max])
     const colorScaleForNegativeValue = d3.scaleLinear()
       .domain([minValue, 0])
       .range([settings.color.negative.max, settings.color.negative.min])
//---------------------End Scales ----------------------------------------------

//---------------------- Axis --------------------------------------------------

   const xAxis = d3.axisBottom(xScale).tickValues([-scaleMaxValue, 0 ,scaleMaxValue])
   const xAxisView = bottomAxisGroup
     .call(xAxis)
   xAxisView
     .selectAll('text')
     .style('fill', settings.color.text.axis);
   xAxisView
     .selectAll('line')
     .style('stroke', settings.color.text.axis);
   xAxisView
     .selectAll('path')
     .style('stroke', settings.color.text.axis);

     const yAxis = d3.axisLeft(yScale)
     const yAxisView = mainGraphGroup
       .call(yAxis)
     yAxisView
       .selectAll('text')
       //.style('font-size','10px')
       .style('fill', settings.color.text.axis);
     yAxisView
       .selectAll('line')
       .style('stroke', settings.color.text.axis);
     yAxisView
       .selectAll('path')
       .style('stroke', settings.color.text.axis);

//---------------------End Axis ------------------------------------------------

//---------------------Brush Bar chart------------------------------------------

 const brushBar = rightGraphGroup
   .append('g')
   .attr('transform', 'translate(0 , '+ margins.top +')')
   .selectAll('rect')
   .data(data)
   .enter()
   .append('rect');

 const brushRectangle = brushBar
   .attr('x', function(d){
      if(d.value < 0){
        return xScaleForBrush(d.value);
      }
      return xScaleForBrush(0);
    })
    .attr('width', 0)
    .attr('y', function(d){return (yScaleForBrush(d.name)+yScaleForBrush.paddingInner());})
    .attr('height', yScaleForBrush.bandwidth())
    .attr('fill', function(d){
      if(d.value < 0){
        return colorScaleForNegativeValue(d.value)
      }
      return colorScaleForPositiveValue(d.value)
    })
    .transition()
    .duration(1000)
    .attr('width', function(d){
      if(d.value < 0){
        return xScaleForBrush(0)-xScaleForBrush(d.value);
      }
      return xScaleForBrush(d.value)-xScaleForBrush(0);
    })
//--------------------- END Brush Bar chart-------------------------------------

//---------------------Main Bars -----------------------------------------------
   const rectangles = mainGraphGroup
     .append('g')
     .selectAll('rect')
     .data(data)
     .enter()
     .append('rect');

    const rectangle = rectangles
     .on('mouseenter', function() {
         d3.select(this)
         .attr('fill', settings.color.mouseHover);
     })
     .on('mouseout', function() {
         d3.select(this)
         .attr('fill', function(d){
           if(d.value < 0){
             return colorScaleForNegativeValue(d.value)
           }
           return colorScaleForPositiveValue(d.value)
         })
     })
     .attr('x', function(d){
        if(d.value < 0){
          return xScale(d.value);
        }
        return xScale(0);
      })
      .attr('width', 0)
      .attr('y', function(d, i){return (yScale(d.name)+yScale.paddingInner());})
      .attr('height', yScale.bandwidth())
      .attr('fill', function(d){
        if(d.value < 0){
          return colorScaleForNegativeValue(d.value)
        }
        return colorScaleForPositiveValue(d.value)
      })
      .transition()
      .duration(1000)
      .attr('width', function(d){
        if(d.value < 0){
          return xScale(0)-xScale(d.value);
        }
        return xScale(d.value)-xScale(0);
      })

}

function findMaxValue(value1, value2){
  if(
    (value1 === undefined || value1 === null)
    ||
    (value2  === undefined || value2 === null))
  {return 0;}
  if(value1 === value2) {return value1}
  const positiveValue1 = Math.abs(value1);
  const positiveValue2 = Math.abs(value2);
  if(positiveValue1 < positiveValue2){return positiveValue2}
  return positiveValue1;
}


function dataSort(unsortedData){
  unsortedData.sort(function(a,b) { return b.value - a.value; })
}
