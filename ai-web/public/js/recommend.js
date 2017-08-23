import micro from '../common/micro'

window.lat = 30.567554
window.lng = 114.375306
let id;
var imgs = {
  '有可无线上网的公共区域':'/imgs/wifi.png',
  '免费停车场':'/imgs/freeparking.png',
  '空调':'/imgs/airconditioning.png',
  '前台贵重物品保险柜':'/imgs/secure.png',
  '电梯':'/imgs/elevator.png',
  '公共区域闭路电视监控系统':'/imgs/monitor.png',
  '大堂免费报纸':'/imgs/read.png',
  '非经营性客人休息区':'/imgs/leisure.png'
}
var facilityMap = {
  '有可无线上网的公共区域':'上网',
  '免费停车场':'停车场',
  '空调':'空调',
  '前台贵重物品保险柜':'保险柜',
  '电梯':'电梯',
  '公共区域闭路电视监控系统':'监控',
  '大堂免费报纸':'报纸',
  '非经营性客人休息区':'休息区'
}
var facility;
var params = {}
var briefIntroduction;
var p2Map = {
  'hotel':'人均消费',
  'restaurant':'人均消费',
  'scenic':"门票"
}
let queryArr = location.search.substring(1).split('&')
for(var i=0;i<queryArr.length;i++){
  params[queryArr[i].split('=')[0]] = decodeURIComponent(queryArr[i].split('=')[1])
}

function renderMap(result){
  if(result.data){
    var map = new AMap.Map('container',{
      resizeEnable: false,
      zoom:13,
      zoomEnable:false,
      dragEnable:false,
      center:[result.data.latlng.split(',')[1],result.data.latlng.split(',')[0]]
    })

    AMap.plugin('AMap.Geocoder',function(){
      var marker = new AMap.Marker({
        map:map,
        bubble:true,
        icon: new AMap.Icon({  //复杂图标
          size: new AMap.Size(24, 32),//图标大小
          image: "/imgs/address.png", //大图地址
        }),
        position:Array.reverse(result.data.latlng.split(','))
      }).on('click',()=>{
        location.href = `/map?latlng=${result.data.latlng.split(',')[0]},${result.data.latlng.split(',')[1]}&names=${result.data.cnName}`
      });
    });
  }
}

function renderDetail(result){
  var data = result.data
  facility = data.facility
  var distance = (data.distance>=1000)?(((data.distance/1000).toFixed(1))+'km'):(data.distance+'m');
  var name = data.cnName.length>14 ? (data.cnName.substr(0,13)+'...') : data.cnName
  $('.intro .name').html(`${name}`)
  $('.intro .away').html(`距您${distance}`)
  var perCapitaSpending;
  if(data.perCapitaSpending==null){
     perCapitaSpending='无数据';
  }else if(data.perCapitaSpending==0||data.perCapitaSpending=='免费'){
     perCapitaSpending='免费';
  }else{
     perCapitaSpending='￥'+data.perCapitaSpending;
  }
  $('.perCapitaSpending .type').html(params.domain == 'scenic'?'门票':'人均')
  $('.perCapitaSpending .value').html(`${perCapitaSpending}`)
  $('.perCapitaSpending').css('display','block')
  
  $('.category span').html(`${data.category}`)
  $('.category').css('display','block')

  $('.time span').html(data.businessTime)
  $('.time').css('display','block')

  if(data.briefIntroduction){
    $('.brefIntro span').html(`${data.briefIntroduction}`)
    $('.brefIntro').css('display','block')
  }
  // $('.time span').html(data.businessTime && data.businessTime.length>15?`${data.businessTime.substr(0,14)}...`:`${data.businessTime}`)
  var img_url = data.imgUrl?data.imgUrl.split(':')[1]:'/imgs/noimg.png'
  $('.image').html(`<img src=${img_url} />`)
  var str = '';
  if(data.facility && data.facility.length > 0){
    for(var i=0;i<data.facility.length;i++){
      if(imgs[data.facility[i]]){
        var imgurl = imgs[data.facility[i]]  
        str = `${str}<div class="item"><img src=${imgurl} /><p>${facilityMap[data.facility[i]]}</p></div>`
      }
    }
    $('.service').html(str)
  }
  if($('.service').html()){
    $('.serviceCon').css('display','block')
  }
}

function getN(obj,N){
  var i = 0;
  var obj2 = {}
  for(var j in obj){
    if(++i<(N+1))
      obj2[j] = obj[j]
  }
  return obj2
}

function renderComment(result){
  var str = '';
  if(result.data){
    if(result.data.commentGather){
      var goods = getN(result.data.commentGather.detail.good,6)
      for(var i in goods){
        var text = i.length>5?(i.substr(0,3)+'...'):i
        str = `${str}<div class="talk_1 good" id=${result.data.entityId} type='hotel'><span class='word' val=${i}>${text}</span><span class="num">${goods[i]}</span></div>`
      }
      var bads = getN(result.data.commentGather.detail.bad,6)
      for(var i in bads){
        var text = i.length>5?(i.substr(0,3)+'...'):i
        str = `${str}<div class="talk_1 bad" id=${result.data.entityId} type='hotel'><span class='word' val=${i}>${text}</span><span class="num">${bads[i]}</span></div>`
      }
      $('.comments .talks').html(str)
      if($('.comments .talks').html()){
        $('.talk_ok.good_comments.comments').css('display','block')
      }
      $('.talk_1').on('click',(item)=>{
        var id = $(item.currentTarget).attr('id')
        var keyword = $(item.currentTarget).find('.word').attr('val')
        location.href = `/detail?entityId=${id}&type=${params.domain}&keyword=${keyword}`
      })
    }
    if(result.data.commentReliability){
      var _str = '';
      var commentReliability = result.data.commentReliability.data
      for(var i in commentReliability){
        _str = `${_str}<div class="talk_ok bad_comments">
        <div>${i}</div>
        <div class="talks">`
        var goodItems = getN(commentReliability[i].detail.good,3)
        for(var j in goodItems){
          _str = `${_str}<div id=${result.data.entityId} class='goodItem' type='hotel'><span class='text'>${j}</span><span class='goodNum'>${goodItems[j]}</span></div>`
        }
        var badItems = getN(commentReliability[i].detail.bad,3)
        for(var j in badItems){
          _str = `${_str}<div id=${result.data.entityId} class='badItem' type='hotel'></span><span class='text'>${j}</span><span class='badNum'>${badItems[j]}</span></div>`
        }
        _str = `${_str}</div></div>`
      }
      $('.reliability').html(_str)
      if($('.reliability').html()){
        $('.reliability,.reliabilityCon').css('display','block')
      }
      $('.reliability .talks div').on('click',(item)=>{
        var id = $(item.currentTarget).attr('id')
        var keyword = $(item.currentTarget).find('.text').html()
        location.href = `/detail?entityId=${id}&type=${params.domain}&keyword=${keyword}`
      })
    }
  }
};
function getData(){    
  var url = params['domain']=='hotel'
    ?'/ai/getHotelById'
    : params['domain']=='scenic'
    ? '/ai/getScenicById'
    : '/ai/getRestaurantById'
  $.ajax({
    type: "GET",
    url:url,
    data: {
      id    : params.id,
      latlng: `${window.lat},${window.lng}`
    },
    dataType: 'json',
    success: function(result){
      renderDetail(result)
      renderMap(result)
    }
  })
  $.ajax({
    type: "GET",
    url:'/ai/getCommentGather',
    data: {
      entityId : params.id,
      type     : params['domain']
    },
    dataType: 'json',
    success: function(result){
      renderComment(result)
    }
  })
};

getData()
// (function(){
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       getData()
//     })
//   })
// })()