$(document).ready(function() {
  
  var urlWorld = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
  
  var urlMeteor = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";
  
  var colors = ["#4286f4", "#42f1f4", "#42f44b", "#ebf442", "#f4b042", "#f44242", "#f442f4"]
  
  var year;
  
  //Width and height
  var w = 1600;
  var h = 800;
  
  //Define map projection
  var projection = d3.geoMercator()
          .translate([w/2, h/2])
          .scale([200]);

  //Define path generator
  var path = d3.geoPath()
           .projection(projection);

  //Create SVG element
  var svg = d3.select("body")
        .append("svg")
        .attr("width", "100%")
        .attr("height", h)
        .call(d3.zoom().on("zoom", function () {
          svg.attr("transform", d3.event.transform)
        }))


  //Load in GeoJSON data
  d3.json(urlWorld, function(data1) {
    
    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
       .data(data1.features)
       .enter()
       .append("path")
       .attr("d", path)
       .style("fill", "#e6e6e6");
    
    //loads in meteorite data
    d3.json(urlMeteor, function(data2) {
      svg.selectAll("path")
       .data(data2.features)
       .enter()
       .append("circle")
       .attr("class", "meteors")
       .attr("cx", function(d) { return projection([d.properties.reclong,d.properties.reclat])[0] })
       .attr("cy", function(d) { return projection([d.properties.reclong,d.properties.reclat])[1] })
       .attr("r", function(d) {
          if(d.properties.mass >= 100000) {
            return 30;
          }
          else if(d.properties.mass >= 50000) {
            return 20;
          }
          else if(d.properties.mass >= 10000) {
            return 15;
          }
          else if(d.properties.mass >= 1000) {
            return 10;
          }
          else if(d.properties.mass >= 500) {
            return 5
          }
          else {
            return 3;
          }
          
       })
       .style("fill", function(d) {
          return colors[Math.floor( Math.random() * colors.length )];
       })
       .on("mouseover", function(d) {
        //Get hovered bar's x/y values, then work it for the tooltip
        var xPosition = parseFloat(d3.select(this).attr("x")) + 1;
        var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;
    
        //changes tooltip position and amount
        d3.select("#tooltip")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .select(".name")
          .text(d.properties.name);
    
        //changes date of tooltip
        d3.select("#tooltip")
          .select(".mass")
          .text(d.properties.mass);
        
        //changes date of tooltip
        d3.select("#tooltip")
          .select(".fall")
          .text(d.properties.fall);
        
        //changes date of tooltip
        d3.select("#tooltip")
          .select(".year")
          .text(function() {
            year = d.properties.year;
            return year.slice(0, 10);
          });
    
        //show tooltip
        d3.select("#tooltip").classed("hidden", false);
    
     })
     .on("mouseout", function() {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);

     });
      
    })
    
  });

      
  
  
  
  
  
  
});