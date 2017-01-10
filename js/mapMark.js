var t = 100;

function moneyStr(a){
  return a['薪資待遇']
}

function delMark(name){
  area_click[name].forEach( function(marker){
    marker.setMap(null);
  })
}

function setMark(data,name,img,filt,cont) {
  t=1000;
  data.forEach( function(result){
    if(result.lng == "NA" || result.lng.trim() =="" )
      return ;
    if(result.section_name+"區" != name) 
      return ;
    if(--t<0) //test
      return ;
    if( !filt(result) )
      return ;

    var latlng = new google.maps.LatLng(result.lat, result.lng)
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: new google.maps.MarkerImage(img,
        null, null, null, new google.maps.Size(17,17)),
    });
    area_click[name].push(marker)
    var infowindow ;
    marker.addListener('mouseover', function() { //mouseover seems annoy
      infowindow = new InfoBubble({
        map: map,
        content: cont(result),
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
  })
}

function homeMark(name) { setMark(
  homedata,
  name,
  './images/home.svg',
  function(result){
    var item=['price','area']
    for(var i in item){
      key = item[i]
      if( select[key+'low'] > +result[key] ) 
        return false;
      else  if( select[key+'high'] < +result[key] ) 
        return false;
    }
    return true;
  },
  function(result){return "<div><h3>"+result.title+"</h3>"+
    "<p>"+result.layout+"</p>" + 
    "<p>"+result.area+"坪</p>" + 
    "<p>月租 NT"+result.price+"</p>" + 
    "<a target='_blank' href='"+result.URL+"'>591_LINK</a>"+
    "</div>"
  }
)}

function workMark(name) { setMark(
  workdata,
  name,
  './images/work.svg',
  function(result){
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
  },
  function(result){ return "<div><h3>"+result.title+"</h3>"+
    "<h4>"+moneyStr(result)+"</h4>" + 
    "<a target='_blank' href='"+result.URL+"'>518_LINK</a>"+
    "</div>"
  }
)}
