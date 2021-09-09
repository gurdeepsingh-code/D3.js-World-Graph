function createSoccerViz()
{
     // call the data file
            d3.csv("data/worldcup.csv", (error, data) => {
                if(error)
                    console.log(error);
                else
                    dataViz(data)
            });
            
            function dataViz(incomingData) 
            {
                d3.select("svg")
                    .append("g")
                    .attr("id", "teamsG")
                    .attr("transform", "translate(50, 300)")
                    .selectAll("g")
                    .data(incomingData)
                    .enter()
                    .append("g")
                    .attr("class", "overallG")
                    .attr("transform", (d,i) => "translate(" + (i*50) +", 0)" )
                
                
               /* <g id="teamsG" x=50/y=300 (svg width/height)>
                    
                    <g class="overallG">
                        x = 0, y =0=300
                        
                        </g>
                    
                    <g class="overallG">
                            x = 50, y =0=300

                            </g>
                    <g class="overallG">
                            x = 100, y =0=300

                            </g>
                    <g class="overallG">
                            x = 150, y =0=300

                            </g>
                    
                    </g>*/
                
                
                var teamG = d3.selectAll("g.overallG");
                
                /*teamG.append("circle")
                    .attr("r", 20);*/
                
                // it will add the cirlces in an animation, making the circle bigger (radius 40)
                // to smaller (radius 20) in span of half-half second
                
                teamG
                  .append("circle")
                    .attr("r", 0)
                  .transition()
                    .delay((d,i) => i * 100)
                    .duration(500)
                    .attr("r", 40)
                  .transition()
                    .duration(500)
                    .attr("r", 20); 
                
                teamG
                  .append("text")
                    .style("text-anchor", "middle")
                    .attr("y", 30)
                    .text(d => d.team);
                
                /*d3.selectAll("g.overallG")
                    .append("circle")
                    .attr("r", 20);*/
                
                teamG.append("text")
                    .attr("y", 40) // y =340 
                    .text(d => d.team);
                
                teamG.on("mouseover", highlightRegion);
                
                teamG.on("mouseout", unhighlightRegion);
                
                 function highlightRegion(d,i) 
                {
                      d3.select(this).select("text").classed("active", true).attr("y", 10);

                      d3.selectAll("g.overallG").select("circle").each(function (p) {
                        p.region == d.region ?
                          d3.select(this).classed("active",true) :
                          d3.select(this).classed("inactive",true);
                      });
                }
                
                function unhighlightRegion()
                {
                        d3.selectAll("g.overallG").select("circle").attr("class", "");
          
                      d3.selectAll("g.overallG").select("text")
                          .classed("active", false).attr("y", 30);
                }
                
                var datakeys = Object.keys(incomingData[0])
                    .filter(d => d !== "team" && d !== "region");
                
                d3.select("#controls")
                    .selectAll("button.teams")
                    .data(datakeys)
                    .enter()
                    .append("button")
                    .on("click", buttonClick)
                    .html(d => d);
                
                function buttonClick(datapoint) 
                {
                    var maxValue = d3.max(incomingData, d => parseFloat(d[datapoint]));
                    var radiusScale = d3.scaleLinear()
                                        .domain([ 0, maxValue ]).range([ 2, 20 ]);
                    
                    /*d3.selectAll("g.overallG")
                        .select("circle")
                        .attr("r", d => radiusScale(d[datapoint]));*/
                    
                    d3.selectAll("g.overallG")
                        .select("circle")
                        .transition().duration(1000)
                        .attr("r", d => radiusScale(d[datapoint]));
                }
            }
}
            
                  
