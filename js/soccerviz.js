function createSoccerViz()
{
     // call the data file
            d3.csv("data/worldcup.csv", (error, data) => {
                if(error)
                    console.log(error);
                else
                    dataViz(data)
            });
    
    // include the html file here
     d3.text("res/modal.html", (error, data) => {
         if(error)
            console.log(error);
        else
                    {
                        d3.select("body")
                            .append("div")
                            .attr("id", "modal")
                            .html(data);
                    }
        
      });
    
    // include icon.svg
   d3.html("res/icon.svg", loadSVG);
   function loadSVG(svgData) {
          d3.selectAll("g.overallG").each(function() {
            var gParent = this;
            d3.select(svgData).selectAll("path").each(function() {
              gParent.appendChild(this.cloneNode(true));
            });
          });

          d3.selectAll("g.overallG").each(function(d) {
            d3.select(this).selectAll("path").datum(d);
          });

          var fourColorScale = d3.scaleOrdinal()
            .domain(["UEFA", "CONMEBOL", "CONCACAF", "AFC"])
            .range(["#5eafc6", "#FE9922", "#93C464", "#fcbc34" ]);

          d3.selectAll("path")
              .style("fill", p => {
                if (p) {
                   return fourColorScale(p.region);
                 }
              })
              .style("stroke", "black").style("stroke-width", "2px");
        }
            
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
                
                // appending text to each of the circle
                
                teamG
                  .append("text")
                    .style("text-anchor", "middle")
                    .attr("y", 30)
                    .text(d => d.team);
                
                teamG.on("click", teamClick); // add a click event on every circle
                
                 function teamClick(d) // if I click on Germany, d holds all the data for Germany
                {
                    d3.selectAll("td.data")
                        .data(d3.values(d)) // all the data of Germany are binded here
                        .html(p => p); // displaying the data
                }
                
                // adding images to each circle
              teamG
                    .insert("image", "text")
                    .attr("xlink:href", d => `images/${d.team}.png`) // use a ` symbol for quotes
                    .attr("width", "45px")
                    .attr("height", "20px")
                    .attr("x", "-22")
                    .attr("y", "-10");
               
                /*d3.selectAll("g.overallG")
                    .append("circle")
                    .attr("r", 20);*/
                
               
                
              /*  teamG.on("mouseover", highlightRegion);
                
                teamG.on("mouseout", unhighlightRegion);
                
                 function highlightRegion(d, i) // if I am hovering the mouse over Germany, my d = Germany record.
                {
                    
                    var teamColor = d3.rgb("#75739F"); // color variable
                    

                    d3.select(this)
                        .select("text")
                        .classed("active", true)
                        .attr("y", 10); // display the text on the circle when you hover

                      d3.selectAll("g.overallG")
                            .select("circle")
                            .style("fill", p => p.region === d.region ?
                                teamColor.darker(.75) : teamColor.brighter(.5));
                    
                    
                          /*.each(function (p) 
                                {
                                    p.region == d.region ?
                                    d3.select(this).classed("active",true) : 
                                    // <circle r=20 class="active"></circle>
                                    d3.select(this).classed("inactive",true);
                                    // <circle r=20 class="inactive"></circle>
                            });*/
                    
                   // this.parentElement.appendChild(this); // as we do not have z-index property here, we need to append this to the end of the DOM elements
              //  }*/
                /*
                function unhighlightRegion()
                {
                    d3.selectAll("g.overallG")
                        .select("circle")
                        .classed("inactive", false)
                        .classed("active", false);
                    
                    d3.selectAll("g.overallG")
                        .select("text")
                        .classed("active", false)
                        .attr("y", 30); // to revert back the text to its original position
                }*/
                
                
                
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
                    
                    // declaring the color category ramp
                     var tenColorScale = d3.scaleOrdinal()
                                        .domain(["UEFA", "CONMEBOL", "CONCACAF",  "AFC"])
                                        .range(d3.schemeCategory10)
                                        .unknown("gray"); // this line is for those entires whose region is not defined
                    
                    var colorQuantize = d3.scaleQuantize()
                                            .domain([0,maxValue])
                                            .range(colorbrewer.Reds[3]);
                    
                    // defining a color ramp here
                    var ybRamp = d3.scaleLinear()
                                    .domain([0,maxValue]).range(["blue", "yellow"]);
                    
                    /*d3.selectAll("g.overallG")
                        .select("circle")
                        .attr("r", d => radiusScale(d[datapoint]));*/
                    
                    d3.selectAll("g.overallG")
                        .select("circle")
                        .transition().duration(1000)
                        .attr("r", d => radiusScale(d[datapoint]))
                        .style("fill", d => colorQuantize(d[datapoint]));
                        /*.style("fill", p => tenColorScale(p.region));*/
                        /*.style("fill", d => ybRamp(d[datapoint]));*/ 
                    // using that color ramp here
                }
            }
}
            
                  
