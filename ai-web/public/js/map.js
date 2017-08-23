import micro from '../common/micro'

var latlngs = location.search.split('&')[0]
var names = location.search.split('&')[1]

var map = new AMap.Map('map',{
  resizeEnable: true
})
var infoWindow = new AMap.InfoWindow();
function markerClick(e){
  infoWindow.setContent(e.target.content);
  infoWindow.open(map, e.target.poi);
}

function renderMap(pos,items){
  var pos = pos.split('|')
  var items = items.split('|')
  var markers = []
  
  for(var i=0;i<pos.length;i++){
    if(pos[i]){
      var lat = pos[i].split(',')[0]
      var lng = pos[i].split(',')[1]
      AMap.plugin('AMap.Geocoder',function(){
        var marker = new AMap.Marker({
          map:map,
          bubble:true,
          icon: new AMap.Icon({  //复杂图标
            size: new AMap.Size(24, 32),//图标大小
            image: "/imgs/address.png", //大图地址
          }),
          position:[lng,lat]
        }).on('click',markerClick)
        marker.content=`<span style="font-size:12px;font-family: PingFangSC-Light;">${items[i]}</span>`
        marker.poi=[lng,lat];
        markers.push(marker)
      });
    }
  }
  map.setFitView();
}

renderMap(decodeURIComponent(latlngs.split('=')[1]),decodeURIComponent(names.split('=')[1]))
