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



//finding mode
var finddata = []
function findStart(premarker,center){
  if(finddata)
  //clear
  map.data.setMap(null)
  for(var name in area_click){
    area_click[name].forEach( function(marker){
      if(premarker != marker) {
        marker.setMap(null);
        finddata.push(center)
      }
    })
  }

  // find 
  var data = []
  if('area' in center)
    workMark(data)
  else
    homeMark(data)

  data.forEach( function(result){
    if( getDistance(result,center) >  1000)
      return ;
    finddata.push(result)
  })
  finddata = setMark(finddata)
  drawCircle(finddata[0])
}

function findEnd(){
  map.data.setMap(map)
  delMark(finddata)
  finddata = []
  refreshMark()
}

function drawCircle(marker){
  var circle = new google.maps.Circle({
    map: map,
    radius: 1000,
    fillColor: '#AA0000'
  });
  circle.bindTo('center', marker, 'position');
}
