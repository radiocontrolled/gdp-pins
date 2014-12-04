
var height,
	width,
	globe,
	projection,
	path, 
	mapScale;

var getMapDimensions = function(){	
	width = document.getElementById("gdp-map");
	width = width.offsetWidth;
	width = width * .80;		
	height = width / 2;
	mapScale = 10;
};

getMapDimensions();
	
var setup = function(w,h) {
	
	globe = d3.select("#gdp-map")
		.append("svg")
		.attr("id", "globe")
		.style("width", w + 'px')
		.style("height", h + 'px');
	
		
	projection = d3.geo.mercator()
		.scale(w/mapScale)
		.translate([w/2, h/1.5]) // center the projection
		.precision(1);
	
	path = d3.geo.path()
		.projection(projection);
  
	/* create a globe */
	globe.append("path")
		.attr("class", "water")
		.attr("d", path);
	
};

setup(width,height);

/* load and display data */
queue()
	.defer(d3.json, "countries.json") /* topjson */
	.defer(d3.json,"gdp.json") /* GDP data */
	.await(countries);



function countries(error, worldTopo, gdp){

	var countriesData = topojson.feature(worldTopo, worldTopo.objects.countries).features;
			
	/* join countries.json to gdp.json */
	for(var i = 0, geo = countriesData; i < geo.length; i++){
	
		for(var key in gdp){
			if(gdp[key]["Country"] == geo[i].properties.countryCode){
				geo[i].properties.cls = "hasGDP"; 
				// just in case ranking is used to class each country (if this is to become a choropleth)
				geo[i].properties.count = parseInt(gdp[key]["Ranking"]);
				// for tooltip showing GDP
				geo[i].properties.grossDomesticProduct = gdp[key]["GDP"];
			}
		}
	}
	
	var world = globe.selectAll("path.land")
		.data(countriesData)
		.enter().append("path")
		.attr("class", function(d){
			//assign each country with a class based on its ranking
			var cls = "country " + d.properties.cls + "-" + d.properties.count; 
			return cls;
		})
		.attr("d", path)
		// on mouseover and mouseout..
		/*
		.on("mouseover", function(d){
					var coordinates = d3.mouse(this);		
					d3.select("#tooltip")
					.style({
							"left": coordinates[0]  + "px",
							"top": coordinates[1] + "px"
						})
						.classed("hidden",false)
						.select("#gdp-number").append("text")
						.text(function(){
							// if the country has a ranking, show the ranking and the country/region name
							if(d.properties.count >= 1){ 
								return d.properties.name + ", Ranking: " + d.properties.count + ", GDP: $" + d.properties.grossDomesticProduct;
							}
							// if the country doesn't have a ranking, say data not available
							else{
								return d.properties.name + ", GDP data not available";
							}
						});

		})
		.on("mouseout",function(d){
			d3.select("#tooltip").classed("hidden",true).select("text").remove();
		})*/
			
	// Create an SVG circle for each node - but how to center it on a path??
	
	var world = globe.append("g")
		.selectAll("circle")
		.data(countriesData)
		.enter()
		.append("g")
		.classed("nodes", true)
		.append("circle")
		.attr("r", function(d,i){
			return 5;
		})
		.attr("cx", function(d){
        	return path.centroid(d)[0];
    	})
    	.attr("cy", function(d){
        	return  path.centroid(d)[1];
    	})
		.style("fill", function(d,i){
			return "#4bc6df;"
		})
		.on("mouseover", function(d){
					var coordinates = d3.mouse(this);		
					d3.select("#tooltip")
					.style({
							"left": coordinates[0]  + "px",
							"top": coordinates[1] + "px"
						})
						.classed("hidden",false)
						.select("#gdp-number").append("text")
						.text(function(){
							// if the country has a ranking, show the ranking and the country/region name
							if(d.properties.count >= 1){ 
								return d.properties.name + ", Ranking: " + d.properties.count + ", GDP: $" + d.properties.grossDomesticProduct;
							}
							// if the country doesn't have a ranking, say data not available
							else{
								return d.properties.name + ", GDP data not available";
							}
						});

		})
		.on("mouseout",function(d){
			d3.select("#tooltip").classed("hidden",true).select("text").remove();
		})
			
		

	
	
	/*
	globe.call(
			d3.behavior.zoom()
				.translate([0, 0])
				.scale(1)
				.scaleExtent([1, 9])
				.on("zoom", zooming));*/
	
	function zooming() {
		world.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		globe.selectAll(".country").style("stroke-width", 0.2 / d3.event.scale + "px");
		
	}

	var tableSetup = function(){
		
		//create the table element
		var gdpTable = document.getElementById("gdp-table");
		var table = document.createElement("table");
		table.classList.add("table", "table-striped");
		
		// caption for accessibility 
		var caption = document.createElement("caption");
		caption.innerHTML = "GDP by country: the raw data";
		table.appendChild(caption);
		gdpTable.appendChild(table);
		
		// set table headings
		var thead = document.createElement("thead");
		var tr = document.createElement("tr");
		thead.appendChild(tr);
		table.appendChild(thead);
		
		
		/* give the table a header and body in the following format
		 * 
		 * +----------------------------+
   		 *  |  Country name |     GDP    |
         *  +---------------+------------+
         *  | United States | 16,800,000 |
         *  |     ...       |     ...    |
         *  |     ...       |     ...    |
         *  +----------------------------+
		 * 
		 */
		
		// header - use the first object to grab the headings
		for(var i in gdp[0]){
			if(gdp[0].hasOwnProperty(i)){
				if(i == "Country name" || i == "GDP"){
					var td = document.createElement("td");
					td.innerHTML = i;
					tr.appendChild(td);	
				}
					
			}
			
		}
	
		// body
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		for(var i in gdp){

			if(gdp.hasOwnProperty(i)){		
				var trBody = document.createElement("tr");
				
				// country name table data
				var tdBody1 = document.createElement("td");
				tdBody1.innerHTML = gdp[i]["Country name"];
				trBody.appendChild(tdBody1);
				
				// gdp table data 
				var tdBody2 = document.createElement("td");
				tdBody2.innerHTML = gdp[i]["GDP"];
				trBody.appendChild(tdBody2);
				
				tbody.appendChild(trBody);
			}
		}
		
	}();
}


d3.select(window).on('resize', resize);

function resize(globe) {
	
	getMapDimensions();

	projection
		.scale(width/mapScale)
		.translate([width/2, height/1.5]) // center the projection
		.precision(0.1);
	
	path = d3.geo.path().projection(projection);
	
	// resize the SVG containing the globe
	d3.select("#globe")
		.style("height", height + "px")
		.style("width", width + "px");
	
	d3.select(".water").attr('d', path);
	d3.selectAll(".country").attr('d', path);	
}


