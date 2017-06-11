function loadChart(data, containerId){
  const settings = {
    color: {
      text: {
        axis: 'rgb(130, 130, 130)'
      },
      mouseHover: 'rgb(65, 176, 238)',
      positive: {
        min: 'rgb(96, 205, 24)',
        max: 'rgb(55, 157, 0)'
      },
      negative: {
        min: 'rgb(240, 53, 41)',
        max: 'rgb(187, 0, 12)'
      }
    }
 };
  const showLayouts = false;
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

  let maxRange = 10;

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

   const brushGroup = svg
     .append('g')
     .attr('class', 'brushGroup')
     .attr('transform', 'translate('+leftGraphWidth+', 0)');
//------------------------------------------------------------------------------

if (data.length > maxRange){
  dataForView = data.slice(0, maxRange)
  scaleMaxValue = findMaxValue(
    d3.max(dataForView, function(d){ return d.value; }),
    d3.min(dataForView, function(d){ return d.value; })
  );
} else {
  //yScale.domain(listOfNames.slice(0, data.length))
  dataForView = data
}

//-------------------- Scales --------------------------------------------------
   const xScale = d3.scaleLinear().range([0, mainWidth]);
xScale.domain([-scaleMaxValue, scaleMaxValue])

   const xScaleForBrush = d3.scaleLinear().range([0, rightGraphWidth])
     .domain(d3.extent(data, (d)=>{return d.value}))

   let listOfNames = dataForView.map(d => {return d.name});
   const listOfNamesForBrush = data.map(d => {return d.name});

   const yScale = d3.scaleBand().range([0, mainHeight]).paddingInner(0.3)
yScale.domain(listOfNames);

   const yScaleForBrush = d3.scaleBand()
     .range([0, (rightGraphHeight-margins.top)]).paddingInner(0.3)
     .domain(listOfNamesForBrush);


   const colorScaleForPositiveValue = d3.scaleLinear()
     .range([settings.color.positive.min, settings.color.positive.max])
     .domain([0, maxValue])
   const colorScaleForNegativeValue = d3.scaleLinear()
     .range([settings.color.negative.max, settings.color.negative.min])
     .domain([minValue, 0])

//---------------------End Scales ----------------------------------------------

//---------------------- Axis --------------------------------------------------
   const xAxis = d3.axisBottom(xScale).tickValues([-scaleMaxValue, 0 ,scaleMaxValue])
   const xAxisView = bottomAxisGroup.call(xAxis)
   xAxisView.selectAll('text')
     .style('fill', settings.color.text.axis);
   xAxisView.selectAll('line')
     .style('stroke', settings.color.text.axis);
   xAxisView.selectAll('path')
     .style('stroke', settings.color.text.axis);

   const yAxis = d3.axisLeft(yScale)
   const yAxisView = mainGraphGroup.call(yAxis)
   yAxisView.selectAll('text')
     .style('fill', settings.color.text.axis);
   yAxisView.selectAll('line')
     .style('stroke', settings.color.text.axis);
   yAxisView.selectAll('path')
     .style('stroke', settings.color.text.axis);
//--------------------- End Axis -----------------------------------------------

//--------------------- Create Brush -------------------------------------------
   const brushExtent = Math.max( 1, Math.min( 20, Math.round(data.length*0.2) ) );
// console.log(data.length);
//     console.dir(brushExtent);

   const brush = d3.brushY()
     .extent([[0, 0], [rightGraphWidth, mainHeight]])
     .on('brush end', brushed);

   const gBrush = d3.select('.brushGroup')
     .append('g')
     .attr('transform', 'translate(0, '+margins.top+')')
     .attr('class', 'brush')
     .call(brush);

     gBrush.selectAll('.overlay')
       .style('fill', 'rgba(100, 100, 100, 0.2)')

     gBrush.selectAll('.selection')
       .attr('fill', 'none')
       .attr('stroke', 'rgba(50, 50, 50, 0.5)');


     gBrush.selectAll('.handle')
      .append('line')
      .attr('x2', rightGraphWidth);

//--------------------- End Brush ----------------------------------------------


//--------------------- Brush Bar chart ----------------------------------------
 const brushBar = rightGraphGroup
   .append('g')
   .attr('transform', 'translate(0 , '+ margins.top +')')
   .selectAll('rect')
   .data(data)
   .enter()
   .append('rect')
   .attr('class', 'bar');

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
    .duration(800)
    .attr('width', function(d){
      if(d.value < 0){
        return xScaleForBrush(0)-xScaleForBrush(d.value);
      }
      return xScaleForBrush(d.value)-xScaleForBrush(0);
    })

   if(data.length > maxRange){
     gBrush.call(brush.move, [yScaleForBrush(data[0].name), yScaleForBrush(data[maxRange].name)]);
   }
//--------------------- END Brush Bar chart-------------------------------------
//---------------------Main Bars -----------------------------------------------
   const update = (list, duration=1000)=>{
     const rectangles = mainGraphGroup
     .append('g')
     .selectAll('rect')
     .data(list)
     .enter()
     .append('rect');

    const rectangle = rectangles
     .attr('class', 'bar')
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
      .duration(duration)
      .attr('width', function(d){
        if(d.value < 0){
          return xScale(0)-xScale(d.value);
        }
        return xScale(d.value)-xScale(0);
      })
    }

 update(dataForView);


//---------------------End Main Bars -------------------------------------------

   function brushed(){
     if (!d3.event.sourceEvent) return;
     if (!d3.event.selection) return;
   //  if (d3.event.type != 'end') return;
     let selection = d3.event.selection || yScaleForBrush.range();
     let index = Math.round(selection[0]/yScaleForBrush.step());
     let index2 = Math.round(selection[1]/yScaleForBrush.step());

     let newList = data.slice(index, index2)

     let MaxValue = findMaxValue(
       d3.max(newList, function(d){ return d.value; }),
       d3.min(newList, function(d){ return d.value; })
     );

     xScale.domain([-MaxValue, MaxValue]);
     xAxis.tickValues([-MaxValue, 0 ,MaxValue])

     listOfNames = newList.map(d => {return d.name});
     yScale.domain(listOfNames);

     mainGraphGroup.selectAll('rect.bar').remove()
     update(newList, 0);

     bottomAxisGroup.call(xAxis)
     mainGraphGroup.call(yAxis)
   }
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
