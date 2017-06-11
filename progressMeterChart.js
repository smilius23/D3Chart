function loadProgressMeter(total, progress, containerId){
  const settings = {
    color: {
      axis: 'rgba(130, 130, 130, 0.3)',
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
 const
   width = 500,
   height = 300,
   twoPi = 2 * Math.PI

 const arc = d3.arc()
     .innerRadius(100)
     .outerRadius(120)
     .startAngle(0);

 const arcBack = d3.arc()
     .innerRadius(88)
     .outerRadius(90)
     .startAngle(0);

 const svg = d3.select('#'+containerId).append('svg')
   .attr('width', width)
   .attr('height', height)
   .append("g")
     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

  const dataset = {
    progress: progress,
    total: total
  };

   var meter = svg.append("g")
       .attr("class", "season-progress");

   var background = meter.append("path")
       .datum({endAngle: twoPi})
       .style("fill", settings.color.axis)
       .attr("d", arcBack);

   var foreground = meter.append("path")
       .datum({endAngle:0})
       .style("fill", settings.color.mouseHover)
       .attr("class", "foreground")
       .attr("d", arc);

   foreground.transition()
     .duration(1000)
     .ease(d3.easeBounce)
     .attrTween("d", function(d) {
                var interpolate = d3.interpolate(d.endAngle, twoPi * dataset["progress"] / dataset["total"])
                return function(t) {
                   d.endAngle = interpolate(t);
                   return arc(d);
                }
             });

     var text =  meter.append("text")
       .attr("text-anchor", "middle")
       .attr("dy", ".35em")
       .attr("font-size", "24")
       .text(dataset["progress"]);

}
