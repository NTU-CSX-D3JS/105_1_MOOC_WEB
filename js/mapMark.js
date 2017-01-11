var th = 0,tw = 0;


function moneyStr(a){
  return a['薪資待遇']
}

function delMark(arr){
  arr.forEach( function(marker){
    marker.setMap(null);
  })
}

function setMark(data){
  th = tw =1000;
  var markers = []
  data.forEach( function(result){
    if(result.lng == "NA" || result.lng.trim() =="" )
      return ;

    // split
    var img,cont
    if('area' in result){
      if(--th<0) //test
        return ;
      img = "./images/home.svg"
      cont = "<div><h3>"+result.title+"</h3>"+
        "<p>"+result.layout+"</p>" + 
        "<p>"+result.area+"坪</p>" + 
        "<p>月租 NT"+result.price+"</p>" + 
        "<a target='_blank' href='"+result.URL+"'>591_LINK</a>"+
        "</div>"
    }
    else{
      if(--tw<0) //test
        return ;
      img = './images/work.svg'
      cont =  "<div><h3>"+result.title+"</h3>"+
        "<h4>"+moneyStr(result)+"</h4>" + 
        "<a target='_blank' href='"+result.URL+"'>518_LINK</a>"+
        "</div>"
    }

    // make mark
    var latlng = new google.maps.LatLng(result.lat, result.lng)
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: {url:img, scaledSize: new google.maps.Size(17,17), anchor: new google.maps.Point(8, 8)}
    });
    markers.push(marker)
    var infowindow ;
    marker.addListener('mouseover', function() { //mouseover seems annoy
      infowindow = new InfoBubble({
        map: map,
        content: cont,
        position: latlng,
        shadowStyle: 1,
        padding: 10,
        borderRadius: 10,
        arrowSize: 10,
        borderWidth: 1,
        borderColor: '#2c2c2c',
        backgroundColor: 'rgba(255,255,255,0.87)',
        disableAutoPan: true,
        arrowPosition: 30,
        arrowStyle: 1,
        opacity: 0.7
      });
      infowindow.open()
    });
    marker.addListener('mouseout', function() { //mouseover seems annoy
      infowindow.close()
    })
    marker.addListener('click', function() { //mouseover seems annoy
      findStart(result)
      console.log(result)
    })
  })
  return markers
}

function homeFilter(result){
  var item=['price','area']
  for(var i in item){
    key = item[i]
    if( select[key+'low'] > +result[key] ) 
      return false;
    else  if( select[key+'high'] < +result[key] ) 
      return false;
  }
  var item=['home0','home1','home2']
  for(var i in item){
    key = item[i]
    if( select[key]!='*' && result.layout.search( select[key] ) ==-1)
    {
      return false
    }
  }
  return true;
}

function workFilter(result){
  var na=0;
  var item = ['hourlow','hourhigh','daylow','dayhigh','monthlow','monthhigh']
  for(var i in item){
    key = item[i]
    if(result[key] == 'NA'){
      ++na;
    }
    else if( result[key] == '+'){
      if( key.search("low")>-1) {
        if(+result[key.slice(0,-3)+"high"] < select[key])
          return false;
      }
      else{
        if(+result[key.slice(0,-4)+"low"] > select[key])
          return false;
      }
    }
    else if( key.search("low")>-1) {
      if(+result[key] < select[key])
        return false;
    }
    else if( key.search("high")>-1){
      if(+result[key] > select[key])
        return false;
    }
    else
      console.log(select)
  }
  if(na==6 && select['novalue'] == true) // no money
    return false;
  return true;
}

function homeMark(arr){
  homedata.forEach( function(result){
    if(homeFilter(result))
      arr.push(result)
  })
}

function workMark(arr){
  workdata.forEach( function(result){
    if(workFilter(result))
      arr.push(result)
  })
}

function buildMark(name){ // for area_click
  workMark(area_click[name])
  homeMark(area_click[name])

  var clicks = []
  area_click[name].forEach( function(result){
    if(result.section_name+"區" != name) 
      return ;
    clicks.push(result)
  })
  area_click[name] = setMark(clicks)
}

function refreshMark(){ // for area_click
  for(var name in area_click){
    delMark(area_click[name])
    area_click[name] = []
    buildMark(name)
  }
}
