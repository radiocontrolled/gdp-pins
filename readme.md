
#Visualising GDP data by country

* convert CSV into JSON
 * mung CSV using Excel - remove white space, give each column a header: Country, Ranking, Country name, GDP and Notes 
 * match country codes and names to those used in countries.json file. E.g "St. Kitts and Nevis" becomes "Saint Kitts and Nevis" etc.
 * create a new CSV with the results called GrossDomesticProduct2013.csv and use http://www.convertcsv.com/csv-to-json.htm to convert GrossDomesticProduct2013.csv to json, gdp.json is the result
* geo-locate countries
 * use <a href="https://gist.github.com/alexwebgr/10249781">TopoJSON world map</a> 
 * countries.json and gdp.json share a country code as the key between both files
 * in vis.js, loop through countries.json and inside the loop iterate over the properties of gdp.json - d3.js used to draw map paths
* add map containing country marker pins
 * svg circles added as pins
* add click and hover events to pins showing that country's GDP
 * svg circles have mousover/mouseout event listeners
* add table of country names and GDPs 
 * function tableSetup() 
* Tools / data used: 
 * <a href="http://d3js.org/">D3.JS</a>
 * <a href="https://github.com/mbostock/queue">Queue</a>, asynchronous helper libary
 * <a href="https://github.com/mbostock/topojson/blob/master/topojson.js">topojson.js</a>
 * http://www.convertcsv.com/csv-to-json.htm
 * <a href="https://gist.github.com/alexwebgr/10249781">TopoJSON world map</a>
* Responsive 
 * have added a resize function to make the map responsive + some media queries
 * to-do: creates issue with scrolling if cursor over svg