function loadForce(data, containerId){
  const totalWidth = 400,
        totalHeight = 400
  //--------------------- SVG --------------------------------------------------

    const svg = d3.select('#'+containerId).append('svg')
      .attr('width', totalWidth)
      .attr('height', totalHeight)
  //--------------------- NODES ------------------------------------------------

    const nodes = d3
      .selectAll('.node')
      .data(data)
      .enter()
}
