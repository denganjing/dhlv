import micro from '../common/micro'

window.lat = 30.567554
window.lng = 114.375306
var map = new AMap.Map('map',{
  resizeEnable: false,
  zoomEnable:true,
  dragEnable:true
})
var infoWindow = new AMap.InfoWindow();
function markerClick(e){
  infoWindow.setContent(e.target.content);
  infoWindow.open(map, e.target.poi);
}

// 推荐列表的收缩与展开
var isShrink=true;
$('.img_con').click(function(){
	if(isShrink){
		$('.path_con').animate({'top':'80%'});
		$('.img_con img').css('transform','rotate(180deg)');
	    isShrink=false;
	}else{
		$('.path_con').animate({'top':'3.8rem'});
		$('.img_con img').css('transform','rotate(0deg)');
	    isShrink=true;
	}
	$('.foot_button').toggle();
})
$('.btn2').on('click',()=>{
  gis()
})
//获取本地存储的数据，渲染图表
var travelPlan=localStorage.getItem('travelPlan');
travelPlan=JSON.parse(travelPlan);
function render(){ 
	var item=travelPlan.data.path,
	    item1=travelPlan.data.periods;
	var str=item[0].name,
	    len=item.length,
	    str1=` `,
	    latlng=[];
  var names = []
  var newArr = travelPlan.msg.split(/[<>]/)
  if(newArr.length>1){
    newArr[1] = `<span class='highLight'>${newArr[1]}</span>`
    newArr[3] = `<span class='highLight'>${newArr[3]}</span>`
  }

  $('.path_msg').html(newArr.join(''));
	$('.start').html(item[0].name);
	$('.end').html(item[len-1].name);
  for(var i=1;i<len;i++){
  	str+='-'+item[i].name;
  }
  for(var j=0;j<len-1;j++){
    var walkDistance
    if(item1[j].walkDistance >= 1000)
      walkDistance = (item1[j].walkDistance/1000).toFixed(1)+'km'
    else{
      walkDistance = item1[j].walkDistance+'m'
    }
    str1+=`<li>
      <img src="imgs/Group4.png" class="li_img" />
      <div class="div_con">
        <div class="path_img"><img src=${item[j].imgUrl}></div>
        <div class="path_detail">
            <p class="title"><span class="detail_title">${item[j].name}</span></p>
            <p class="intro">${item[j].briefIntroduction}</p>
        </div>
      </div>
    <div class="cate_time">
      <p>
        <span>全程${walkDistance}</span>：
        <span style='margin-right: 5px;'>步行<span class='cate_type'>(${item1[j].walkPeriod}min)</span></span>
        <span style='margin-right: 5px;'>自行车<span class='cate_type'>(${item1[j].bikePeriod}min)</span></span>
        <span style='margin-right: 5px;'>观光车<span class='cate_type'>(${item1[j].busPeriod}min)</span></span>
      </p>
    </div>
    </li>`;
    latlng.push(item[j].latlng);
    names.push(item[j].name)
  }
  str1+=`<li>
    <img src="imgs/Group4.png" class="li_img">
    <div class="div_con">
      <div class="path_img"><img src=${item[len-1].imgUrl}></div>
      <div class="path_detail">
          <p class="title"><span class="detail_title">${item[len-1].name}</span></p>
          <p class="intro">${item[len-1].briefIntroduction}</p>
      </div>
    </div>
  <li>`
  $('.path_content ul').html(str1);
  latlng.push(item[len-1].latlng);
  names.push(item[len-1].name)
  renderMap(latlng,names);
}

//地图渲染
function renderMap(latlng,names){
  var str='';
  var markers=[],latArr=[];
  for(var i=0;i<latlng.length;i++){
    var lat = latlng[i].split(',')[0];
    var lng = latlng[i].split(',')[1];
    str = str + latlng[i] + '|';
    latArr.push([lng,lat]);
    var marker = new AMap.Marker({
	    map:map,
	    bubble:true,
	    icon: new AMap.Icon({  //复杂图标
  			size: new AMap.Size(24, 32),//图标大小
  			image: "/imgs/address.png", //大图地址
  		}),
      position:[lng,lat]
    })
    
    var marker1=new AMap.Marker({
    	map:map,
        content:'<div class="tip">'+(i+1)+'</div>',
        position:[lng,lat],
        offset: new AMap.Pixel(-1,-30)
    }).on('click',markerClick)

    marker1.content=`<span style="font-size:12px;font-family: PingFangSC-Light;">${names[i]}</span>`
    marker1.poi=[lng,lat];

    markers.push(marker);
  }
  map.setFitView();
};

function gis() {
  var jxIds = travelPlan.data.path.map((item)=>{
    return item.jxId
  })
  GWJSBridge.setup(function(bridge) {
    bridge.callHandler('gis', jxIds);
  });
}

render()
// (function() {
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       render()
//      });
//   });
// })()
