
// var jamestailiu = function(where){
// 	var width = 1024;
// 	var height = 768;
// 	var ctrl = d3.select(where).append("svg").attr("width", width).attr("height", height);
// 	d3.csv("./data/district_rent_distribution.csv", 
// 		function(data)
// 		{
// 			var ln = data.length;
// 			console.log(data);
// 			var maxy = d3.max(data, function(d){ return d.Selling; });
// 			var lines = d3.line().x(function(d,i){return i*(width/ln);}).y(function(d){return height-d.Selling*(height/maxy)});
// 			ctrl.append("path").data([data]).attr("d", lines).attr("stroke", "red").attr("fill", "none");
// 		}
// );
// }


var pie = new d3pie("pieChart", {
	"header": {
		"title": {
			"text": "台北市各區租屋價格比例",
			"color": "#bc2727",
			"fontSize": 28,
			"font": "open sans"
		},
		"subtitle": {
			"text": "大安區",
			"color": "#406e45",
			"fontSize": 21,
			"font": "open sans"
		}
	},
	"footer": {
		"text": "資料來源: 591租屋網",
		"color": "#1b2bb5",
		"fontSize": 13,
		"font": "open sans",
		"location": "bottom-center"
	},
	"size": {
		"canvasHeight": 450,
		"canvasWidth": 620,
		"pieInnerRadius": "64%",
		"pieOuterRadius": "94%"
	},
	"data": {
		"smallSegmentGrouping": {
			"enabled": true,
			"value": 0
		},
		"content": [
			{
				"label": "10000 以下",
				"value": 210,
				"color": "#2383c1"
			},
			{
				"label": "10000~20000",
				"value": 227,
				"color": "#b9aa2d"
			},
			{
				"label": "20000~30000",
				"value": 161,
				"color": "#7b6788"
			},
			{
				"label": "30000~40000",
				"value": 112,
				"color": "#43bf3a"
			},
			{
				"label": "40000 以上",
				"value": 705,
				"color": "#da180e"
			}
		]
	},
	"labels": {
		"outer": {
			"format": "label-percentage2",
			"pieDistance": 32
		},
		"inner": {
			"format": "value"
		},
		"mainLabel": {
			"font": "exo",
			"fontSize": 12
		},
		"percentage": {
			"color": "#2c6835",
			"font": "open sans",
			"fontSize": 13,
			"decimalPlaces": 1
		},
		"value": {
			"color": "#1e2807",
			"font": "exo",
			"fontSize": 13
		},
		"lines": {
			"enabled": true,
			"style": "straight"
		},
		"truncation": {
			"enabled": true
		}
	},
	"tooltips": {
		"enabled": true,
		"type": "placeholder",
		"string": "{label}: {value}, {percentage}%",
		"styles": {
			"fadeInSpeed": 490,
			"backgroundColor": "#8a7e7e",
			"backgroundOpacity": 0.49,
			"color": "#181313",
			"font": "garamond"
		}
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400
		}
	},
	"misc": {
		"canvasPadding": {
			"top": 10,
			"right": 10,
			"bottom": 10,
			"left": 10
		},
		"pieCenterOffset": {
			"y": -5
		}
	}
});
