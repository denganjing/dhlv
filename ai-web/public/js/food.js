import micro from '../common/micro'

window.lat = 30.567554
window.lng = 114.375306
var map = new AMap.Map('container',{
  resizeEnable: false,
  zoomEnable:false,
  dragEnable:false
});
var obj = {
  'weather':'weather',
  'hotel':'food',
  'scenic':'food',
  'restaurant':'food',
  'unknown':'faq',
  'congestion':'density',
  'poi':'poi'
}
var cat = {
  "RESTAURANT_RECOMMEND":"餐厅",
  "HOTEL_RECOMMEND":"酒店",
  "SCENIC_RECOMMEND":"景点",
}
let query = {}
let queryArr = location.search.substring(1).split('&')
for(var i=0;i<queryArr.length;i++){
  query[queryArr[i].split('=')[0]] = decodeURIComponent(queryArr[i].split('=')[1])
}
function getScore(val){
  var val = parseInt(val)
  var str = ''
  for(var i=0;i<val;i++){
    str = `${str}<img src='imgs/star_light.png' />`
  }
  for(var j=val;j<5;j++){
    str = `${str}<img src='imgs/star_dark.png' />`
  }
  return str;
}

function getList(){
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
        $('.search input').val(result.query)
        renderList(result);
        judge(result);
        renderMap(result);
      }
    })
  }
  else{
    $('.search input').val(query.query)
    var result = JSON.parse(localStorage.getItem('food_result'))
    renderList(result);
    judge(result);
    renderMap(result);
  }
}

 // 判断排序方式
var isClick=true;
function judge(result){
  var dis=$.map(result.data.detail,function(n){
    return n;
  })
  $('.selectlist li').click(function(e){
    e.stopPropagation()
    $('.select').html($(this).html())
    var judge=$(this).attr('class');
    if(judge=='dis'){
      dis.sort(function(a,b){
           return a.distance-b.distance
      });
      $('.shrink_con').slideUp("fast");
      isClick=true;
      rerenderList(result,dis);
    }else{
      dis=$.map(result.data.detail,function(n){
        return n;
      })
      $('.shrink_con').slideUp("fast");
      isClick=true;
      rerenderList(result,dis);
    }
  });
}
$('.select').click(function(){
  if(isClick){
    $('.shrink_con').slideDown("fast");
    isClick=false;
  }else{
    $('.shrink_con').slideUp("fast");
    isClick=true;
  }
  
})
function rerenderList(result,dis){
  var str = ``;
  if(result && result.data && result.data.detail && result.data.detail.length > 0){
    if(dis==undefined){
      var dis=result.data.detail;
    }
    for(var i in dis){
      var item=dis[i];
      var distance = (item.distance>=1000)?(((item.distance/1000).toFixed(1))+'km'):(item.distance+'m')
      var spending = '' ;
      if(item.perCapitaSpending == '0')
        spending='免费'
      else if(!item.perCapitaSpending || item.perCapitaSpending == '无门票信息')
        spending = ((query.domain == 'scenic') ? '无门票信息' : '无消费信息')
      else
        spending = '￥'+item.perCapitaSpending+'/人'
      var imgUrl = item.imgUrl ? item.imgUrl.split(':')[1] : '/imgs/noimg.png'
      var tags = item.wordList.join('  ')
      tags = tags.length > 17 ? (tags.substr(0,16)+'...') : tags
      str = `${str}<div class="res_1" id=${item.id}>
       <div class="top_left"><img class="pic" src=${imgUrl} /></div>
       <div class="top_right">
          <p class="name">${item.cnName}</p>
          <p class='tags'>${tags}</p>
          <p class='score'>${getScore(item.evaluation)}</p>
          <span class="qian">${spending}</span>
       </div>
       <div class="distance">距您<span>${distance}</span></div>
      </div>`
    }
  }
  $('.top_result .place').html(result.data.place)
  $('.top_result .num').html(result.data.detail.length)
  $('.top_result .cate').html(cat[result.actionEnum])
  $('.content_result').html(str)
  $('.content_result .res_1').on('click',(item)=>{
    item.stopPropagation()
    let id = $(item.currentTarget).attr('id')
    location.href=`/recommend?domain=${result.data.action}&id=${id}`;
  })
}

function renderList(result,dis){
  $('.listcontent').fadeOut()
  $('.emptyResult').fadeOut()
  var str = ``;
  if(result && result.data && result.data.detail && result.data.detail.length > 0){
    $('.listcontent').fadeIn()
    if(dis==undefined){
      var dis=result.data.detail;
    }
    for(var i in dis){
      var item=dis[i];
      var distance = (item.distance>=1000)?(((item.distance/1000).toFixed(1))+'km'):(item.distance+'m')
      var spending = '' ;
      if(item.perCapitaSpending == '0')
        spending='免费'
      else if(!item.perCapitaSpending || item.perCapitaSpending == '无门票信息')
        spending = ((query.domain == 'scenic') ? '无门票信息' : '无消费信息')
      else
        spending = '￥'+item.perCapitaSpending+'/人'
      var imgUrl = item.imgUrl ? item.imgUrl.split(':')[1] : '/imgs/noimg.png'
      var tags = item.wordList.join('  ')
      tags = tags.length > 17 ? (tags.substr(0,16)+'...') : tags
      str = `${str}<div class="res_1" id=${item.id}>
       <div class="top_left"><img class="pic" src=${imgUrl} /></div>
       <div class="top_right">
          <p class="name">${item.cnName}</p>
          <p class='tags'>${tags}</p>
          <p class='score'>${getScore(item.evaluation)}</p>
          <span class="qian">${spending}</span>
       </div>
       <div class="distance">距您<span>${distance}</span></div>
      </div>`
    }
  }
  else{
    $('.emptyResult').html(result.msg).fadeIn()
  }
  $('.top_result .place').html(result.data.place)
  $('.top_result .num').html(result.data.detail.length)
  $('.top_result .cate').html(cat[result.actionEnum])
  $('.content_result').html(str)
  $('.content_result .res_1').on('click',(item)=>{
    item.stopPropagation()
    let id = $(item.currentTarget).attr('id')
    location.href=`/recommend?domain=${result.data.action}&id=${id}`;
  })
}

function renderMap(result){
  
  var data = result.data ? result.data.detail : 0 ;
  
  var str='', names;
  var markers = []
  if(data && data.length > 0){
    for(var i=0;i<data.length;i++){
      var lat = data[i].latlng.split(',')[0]
      var lng = data[i].latlng.split(',')[1]
      str = str + data[i].latlng + '|'
      names = names + data[i].cnName + '|'
      var marker = new AMap.Marker({
        map:map,
        bubble:true,
        icon: new AMap.Icon({  //复杂图标
          size: new AMap.Size(24, 32),//图标大小
          image: "/imgs/address.png", //大图地址
        }),
        position:[lng,lat]
      })
      markers.push(marker);
    }
    map.setFitView()
    for(var j in markers){
      markers[j].on('click',()=>{
        location.href = `/map?latlng=${str}&names=${names}`
      });
    }
  }
};

getList()
// (function(){
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       getList()
//      });
//   });
// })()

