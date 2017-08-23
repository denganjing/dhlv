import micro from '../common/micro'

window.lat = 30.567554
window.lng = 114.375306

let dayMap = ['日','一','二','三','四','五','六']
let imgsMap = {
  '晴':'/imgs/sunny.png',
  '多云':'/imgs/cloud.png',
  '少云':'/imgs/cloud.png',
  '晴间多云':'/imgs/cloud.png',
  '阴':'/imgs/cloudy.png',
  '有风':'/imgs/sandstorm.png',
  '平静':'/imgs/sunrise.png',
  '微风':'/imgs/sunrise.png',
  '和风':'/imgs/sunrise.png',
  '清风':'/imgs/sunrise.png',
  '强风/劲风':'/imgs/sandstorm.png',
  '疾风':'/imgs/sandstorm.png',
  '大风':'/imgs/sandstorm.png',
  '烈风':'/imgs/sandstorm.png',
  '风暴':'/imgs/sandstorm.png',
  '狂爆风':'/imgs/sandstorm.png',
  '飓风':'/imgs/sandstorm.png',
  '龙卷风':'/imgs/sandstorm.png',
  '热带风暴':'/imgs/sandstorm.png',
  '阵雨':'/imgs/spit.png',
  '强阵雨':'/imgs/heavyrain.png',
  '雷阵雨':'/imgs/heavyrain.png',
  '强雷阵雨':'/imgs/heavyrain.png',
  '雷阵雨伴有冰雹':'/imgs/heavyrain.png',
  '小雨':'/imgs/spit.png',
  '中雨':'/imgs/spit.png',
  '大雨':'/imgs/heavyrain.png',
  '极端降雨':'/imgs/heavyrain.png',
  '毛毛雨/细雨':'/imgs/spit.png',
  '暴雨':'/imgs/heavyrain.png',
  '大暴雨':'/imgs/heavyrain.png',
  '特大暴雨':'/imgs/heavyrain.png',
  '冻雨':'/imgs/heavyrain.png',
  '小雪':'/imgs/flurry.png',
  '中雪':'/imgs/flurry.png',
  '大雪':'/imgs/heavysnow.png',
  '暴雪':'/imgs/heavysnow.png',
  '雨夹雪':'/imgs/heavysnow.png',
  '雨雪天气':'/imgs/heavysnow.png',
  '阵雨夹雪':'/imgs/heavysnow.png',
  '阵雪':'/imgs/heavysnow.png',
  '薄雾':'/imgs/fog.png',
  '雾':'/imgs/fog.png',
  '霾':'/imgs/fog.png',
  '扬沙':'/imgs/duststorm.png',
  '浮尘':'/imgs/duststorm.png',
  '沙尘暴':'/imgs/duststorm.png',
  '强沙尘暴':'/imgs/duststorm.png',
  '热':'/imgs/sunny.png',
  '冷':'/imgs/heavysnow.png',
  '未知':'/imgs/sunrise.png'
}
var maxTemp = [], minTemp = [], max, min;

const Weather = function(){
  this.key = '287bfd1538be4598946109888e281d0c'
  this.getCity()
  this.getPro()
  $('#myCanvas,#myCanvas2,#myCanvas3,#myCanvas4').attr('width',parseFloat($('.days').css('width')))
}
Weather.prototype.getCity = function() {
  this.params = {}
  let queryArr = location.search.substring(1).split('&')
  for(var i=0;i<queryArr.length;i++){
    this.params[queryArr[i].split('=')[0]] = decodeURIComponent(queryArr[i].split('=')[1])
  }
}
Weather.prototype.getPro = function() {
  let self = this;
  if( self.params.hasOwnProperty("queryId")){
    $.ajax({
    type: "GET",
    url:'/ai/recommendByID',
    data: {
      queryId:  self.params.queryId,
      latlng : `${window.lat},${window.lng}`
    },
    dataType: 'json',
    success: function(result){
       self.renderWeather(result)
      }
    })
  }else{
    var result = JSON.parse(localStorage.getItem('weather_result'))
    this.renderWeather(result)
  }
};

Weather.prototype.renderWeather = function(result) {
  var self = this
  $('.search input').val(result.query)
  $.ajax({
    type:"get",
    url:`https://free-api.heweather.com/x3/weather?cityid=${result.data.cityObject.id}&key=${self.key}`,
    success:function(msg){
      var data = msg["HeWeather data service 3.0"][0];
      var detail = data.daily_forecast;
      $('.low').html(detail[0].tmp.min)
      $('.high').html(detail[0].tmp.max)
      $("#icon").attr('src',imgsMap[data.now.cond.txt])
      $('.clode_2').html(data.now.cond.txt)
      $('.clode_3').html(`${data.now.tmp}<span>o</span>`)
      $('.detail .city').html(data.basic.city)
      $('.qlty').html(data.aqi.city.qlty)
      $('.vis').html(data.now.vis+'km')
      $('.wind').html(data.now.wind.dir+' '+data.now.wind.sc)

      var str = ''
      max = parseInt(detail[0].tmp.max)
      min = parseInt(detail[0].tmp.min)

      for(var i=0;i<detail.length-2;i++){
        var xingqi=detail[i].date;
        var a =dayMap[new Date(xingqi).getDay()];
        var maxTmp = parseInt(detail[i].tmp.max)
        var minTmp = parseInt(detail[i].tmp.min)

        if(maxTmp>max) max = maxTmp
        if(minTmp<min) min = minTmp
        maxTemp.push(maxTmp)
        minTemp.push(minTmp)
        var day = i==0 ? '今天' : `周${a}`
        var txt = detail[i].cond.txt_d
        if(txt == '强风/劲风') txt = '强风'
        if(txt == '雷阵雨伴有冰雹') txt = '雷雨'
        if(txt == '毛毛雨/细雨') txt = '小雨'
        str=`${str}<div class='item'>
          <div>${day}</div>
          <div class='temp'><span>${xingqi.slice(5).replace('-','/')}</div>
          <img src=${imgsMap[detail[i].cond.txt_d]} />
          <div class='weather_con'>${txt}</div>
          <div class='line'></div>
          <div class='item_temp'>
          <span>${detail[i].tmp.min}</span><img src='/imgs/degree.png' class='du'/><span>&nbsp;~</span>
          <span>${detail[i].tmp.max}</span><img src='/imgs/degree.png' class='du'/>
          </div>
        </div>`
      }
      $(".days .items").html(str)
      self.renderTempLine();
      $(".bot .txt").html(data.suggestion.drsg.txt);
    }
  })
}
Weather.prototype.renderTempLine = function(){
  var divWidth  = $('.days .item')[0].offsetWidth
  var myCanvas  = document.getElementById("myCanvas");
  var myCanvas2 = document.getElementById("myCanvas2");
  var context   = myCanvas.getContext("2d");
  var context2  = myCanvas2.getContext("2d");
  var myCanvas3 = document.getElementById("myCanvas3");
  var myCanvas4 = document.getElementById("myCanvas4");
  var context3  = myCanvas3.getContext("2d");
  var context4  = myCanvas4.getContext("2d");
  context.strokeStyle  = 'rgba(255, 255, 255, 0.6)';
  context2.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  context.lineWidth    = context2.lineWidth = 1;
  context.fillStyle    = 'rgba(255, 255, 255, 0.6)';
  context2.fillStyle   = 'rgba(255, 255, 255, 0.6)';
  context3.strokeStyle = '#3BCB71';
  context4.strokeStyle = '#2F69FF';
  context3.lineWidth   = context4.lineWidth = 1;

  for(var i=0;i<maxTemp.length;i++){
    context.beginPath();
    var top = (max-maxTemp[i])?(max-maxTemp[i])*80/(max-min):5
    context.arc(divWidth*i+divWidth/2, top, 3, 0, Math.PI * 2, false);
    context.closePath();
    context.fill()
  }
  context.stroke();//画线框

  for(var i=0;i<minTemp.length;i++){
    context2.beginPath();
    var top = (minTemp[i]-min)?(80-((minTemp[i]-min)*80/(max-min))):75
    context2.arc(divWidth*i+divWidth/2, top, 3, 0, Math.PI * 2, false);
    context2.closePath();
    context2.fill()
  }
  context2.stroke();//画线框

  var top1 = (max-maxTemp[0])?(max-maxTemp[0])*80/(max-min):5
  context3.moveTo(divWidth/2,top1)
  context3.beginPath()
  for(var i=0;i<maxTemp.length;i++){
    var top = (max-maxTemp[i])?(max-maxTemp[i])*80/(max-min):5
    context3.lineTo(divWidth*i+divWidth/2,top)
  }
  context3.stroke()

  var top2 = (minTemp[0]-min)?(80-((minTemp[0]-min)*80/(max-min))):75
  context4.moveTo(divWidth/2,top2)
  context4.beginPath()
  for(var i=0;i<minTemp.length;i++){
    var top = (minTemp[i]-min)?(80-((minTemp[i]-min)*80/(max-min))):75
    context4.lineTo(divWidth*i+divWidth/2,top)
  }
  context4.stroke()
};

let weather = new Weather()
// (function() {
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       let weather = new Weather()
//      });
//   });
// })()