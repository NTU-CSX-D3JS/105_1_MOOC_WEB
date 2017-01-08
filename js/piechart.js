
d3.csv("./data/district_rent_distribution.csv", function(data){
	console.log(data)
	init(data)
})

function init(data){
	for (var i = 0 ; i < data.length; ++i) {
		var name = data[i]['行政區']
		var csvhead = ['10000以下','10000~20000','20000~30000','30000~40000','40000以上']
		var arr = []
		for(var j=0;j<csvhead.length;++j)
			arr.push( +data[i][ csvhead[j] ] )
		$("#pieChart").append("<div id='pieChart"+i+"'></div>")
		var pie = new d3pie("pieChart"+i, setPie(name,arr))
	}
};

setPie = function(name,arr){
	return {
		"header": {
			"title": {
				"text": "台北市各區租屋價格比例",
				"color": "#bc2727",
				"fontSize": 28,
				"font": "open sans"
			},
			"subtitle": {
				"text": name,
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
			"canvasWidth": Math.min( $("#pieChart").width()-20 , 620 ),
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
					"value": arr[0],
					"color": "#2383c1"
				},
				{
					"label": "10000~20000",
					"value": arr[1],
					"color": "#b9aa2d"
				},
				{
					"label": "20000~30000",
					"value": arr[2],
					"color": "#7b6788"
				},
				{
					"label": "30000~40000",
					"value": arr[3],
					"color": "#43bf3a"
				},
				{
					"label": "40000 以上",
					"value": arr[4],
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
				"color": "#ffffff",
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
	}
}
