var jamestailiu = function(where){
	var width = 1024;
	var height = 768;
	var ctrl = d3.select(where).append("svg").attr("width", width).attr("height", height);
	d3.csv("./data/yen.csv", 
		function(data)
		{
			var ln = data.length;
			console.log(data);
			var maxy = d3.max(data, function(d){ return d.Selling; });
			var lines = d3.line().x(function(d,i){return i*(width/ln);}).y(function(d){return height-d.Selling*(height/maxy)});
			ctrl.append("path").data([data]).attr("d", lines).attr("stroke", "red").attr("fill", "none");
		}
);
}
