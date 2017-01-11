var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat);
  var dLong = rad(p2.lng - p1.lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

var finddata = []
var findcircle = null
var circleR = 1000;
var fakecenter = null
var listen = null


function radiusChange(){
  $("#circleRword").text( $("#circleR")[0].value )
  circleR = +$("#circleR")[0].value*1000
  if( finddata.length > 0 )
    findStart(fakecenter)
}

function findStart(center){
  if(listen == null){
    listen = "HI"
    listen = google.maps.event.addListener(map,'click',function(event){
      console.log(event)
      var a= {}
      a.lng = ""+event.latLng.lng()
      a.lat = ""+event.latLng.lat()
      a.all = true
      findStart(a)
    })
  }


  $("#circlemode").show()
  if(finddata.length > 0){
    delMark(finddata)
    finddata = []
    findcircle.setMap(null)
  }
  //clear
  map.data.setMap(null)
  for(var name in area_click)
    delMark(area_click[name])

  // find 
  var data = []
  if( 'all' in center){
    workMark(data)
    homeMark(data)
  }
  else if('area' in center)
    workMark(data)
  else
    homeMark(data)

  finddata.push(center)
  data.forEach( function(result){
    if( getDistance(result,center) >  circleR)
      return ;
    finddata.push(result)
  })
  if(finddata.length == 0)
    return ;

  fakecenter = center
  finddata = setMark(finddata)
  drawCircle(finddata[0])
}

function findEnd(){
  map.data.setMap(map)
  delMark(finddata)
  if(finddata.length > 0){
    findcircle.setMap(null)
    listen.remove()
    listen = null
  }
  finddata = []
  refreshMark()
  $("#circlemode").hide()
}

function drawCircle(marker){
  var circle = new google.maps.Circle({
    map: map,
    radius: circleR,
    fillColor: '#AA0000'
  });
  circle.bindTo('center', marker, 'position');
  findcircle = circle
}
