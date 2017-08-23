import micro from '../common/micro'

var map
var query = {}
window.lat = 30.567554;
window.lng = 114.375306;

function getParams(callback){
  let queryArr = location.search.substring(1).split('&')
  for(var i=0;i<queryArr.length;i++){
    query[queryArr[i].split('=')[0]] = decodeURIComponent(queryArr[i].split('=')[1])
  }
  callback()
}
var infoWindow = new AMap.InfoWindow();
function markerClick(e){
  infoWindow.setContent(e.target.content);
  infoWindow.open(map, e.target.poi);
}

function renderMap(arr){
  var markers = []
  map = new AMap.Map('map',{
    resizeEnable: true,
    center:[window.lat,window.lng]
  })
  for(var i in arr){
    if(arr[i].gdcoor){
      var lng = arr[i].gdcoor.split(',')[0]
      var lat = arr[i].gdcoor.split(',')[1]
      var marker = new AMap.Marker({
        map:map,
        bubble:true,
        icon: new AMap.Icon({  //复杂图标
          size: new AMap.Size(24, 32),//图标大小
          image: "/imgs/address.png", //大图地址
        }),
        position:[lng,lat]
      }).on('click',markerClick)
      marker.content=`<span style="font-size:12px;font-family: PingFangSC-Light;">${arr[i].name}</span>`
      marker.poi=[lng,lat];
      markers.push(marker)
    }
  }

  var marker = new AMap.Marker({
    map:map,
    bubble:true,
    icon: new AMap.Icon({  //复杂图标
      size: new AMap.Size(24, 32),//图标大小
      image: "/imgs/currentPoi.png", //大图地址
    }),
    position:[window.lng,window.lat]
  }).on('click',markerClick)
  marker.content=`<span style="font-size:12px;font-family: PingFangSC-Light;">当前位置</span>`
  marker.poi=[window.lng,window.lat];
  markers.push(marker)

  infoWindow.setContent(marker.content);
  infoWindow.open(map, marker.poi);

  map.setFitView();
}

function getPois(){
  if(query.hasOwnProperty("queryId")){
    $.ajax({
      type: "GET",
      url:'/ai/recommendByID',
      data: {
        queryId: query.queryId,
        latlng : `${window.lat},${window.lng}`
      },
      dataType: 'json',
      success: function(result){
        if(!result.isError) {
          $('.search input').val(result.query)
          renderMap(result.data[0].pois);
        }else {
          $('.modal').html(result.msg).css('display','block')
        }
      }
    })
  }else{
    $('.search input').val(query.query)
    var result = JSON.parse(localStorage.getItem('poi_result'))
    renderMap(result.data[0].pois)
  }
};

getParams(getPois)
// (function(){
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       getParams(getPois)
//     })
//   })
// })()
