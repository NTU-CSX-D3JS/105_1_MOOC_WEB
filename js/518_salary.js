function salary_518(where,whichdata,interval){
	d3.csv("./data/518_Taipei_ok.csv", function(data){
		var width = 1024,
			height = 512;
		var left = 60,
			bottom = 60;

		var svg = 
			d3.select(where)
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append('g')
				.attr("transform","translate(" + left + ",0)");

		// set the ranges
		var x = d3.scaleLinear().range([0, width-left]);
		var y = d3.scaleLinear().range([height-bottom,0]);

		// to new data
		var newdata = []
		data.forEach( function(d){
			var which = whichdata+"low"
			if ( d[which]  && d[which] != 'NA' && d[which]!="+")
				newdata.push(+d[which])
		})
		newdata.sort( function(a,b){return a>b})
		//console.log(newdata)

		// to count data
		var countdata = [],now=-1;
		newdata.forEach(function(d){
			var anchor = Math.floor(d/interval)*interval;
			if( anchor != now ) {
				now = anchor;
				countdata.push({'anchor':anchor,'time':0})
			}
			countdata[countdata.length-1]['time'] ++;
		})
		//console.log(countdata)

		// domain 
		x.domain([0, d3.max(countdata, function(d) { return d.anchor; })*1.05]);
		y.domain([0, d3.max(countdata, function(d) { return d.time;   })*1.05]);

		// axis
		svg.append("g")
			.attr("transform", "translate(0," + (height-bottom) + ")")
			.call(d3.axisBottom(x));
		svg.append("g")
			.call(d3.axisLeft(y));

		// lines
		var lines = d3.line()
			.x(function(d) { return x(d.anchor); })
			.y(function(d) { return y(d.time  ); })

		// path
		svg.append("path")
			.data([countdata])
			.attr("d", lines)
			.attr("stroke", "red")
			.attr("stroke-width", "1px")
			.attr("fill", "none");

		// label
		svg.append("text")             
			.attr("x",width-left-70)
			.attr("y",height-bottom/2)
			.style("text-anchor", "middle")
			.text("Salary(NTD)");
		svg.append("text")             
			.attr("transform", "rotate(-90)")
			.attr("x",-60)
			.attr("y",-left/2)
			.style("text-anchor", "middle")
			.text("Numbers");

		// text
		svg.append("g")
			.selectAll("text")
			.data(countdata)
			.enter().append("text")
			.attr("x",function(d) { return x(d.anchor); })
			.attr("y",function(d) { return y(d.time  )-10; })
			.style("text-anchor", "middle")
			.style("font-size", "10px")
			.text(function(d) { return   d.time; })
	})
}
