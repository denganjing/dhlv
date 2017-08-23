import renderWave from '../components/curve'
window.lat = 30.567554;
window.lng = 114.375306;
var interval
var obj = {
  'WEATHER_RECOMMEND':'weather',
  'HOTEL_RECOMMEND':'food',
  'SCENIC_RECOMMEND':'food',
  'RESTAURANT_RECOMMEND':'food',
  'FAQ_RECOMMEND':'faq',
  'FAQ_RECOMMEND_HOT':'faq',
  'CONGESTION':'density',
  'POI':'poi'
}

function cb(data){
  var word;
  try{
    word = data.result.word
  }catch(e){
    word = data
  }
  $('.con').css('display','none')
  $('.listening').css('display','block')
  $('.unknown').css('display','none')
  $.ajax({
    type: "get",
    url:'/ai/recommend',
    data: {
      query : word,
      latlng:`${window.lat},${window.lng}`
    },
    dataType: 'json',
    timeout: 30000,
    success: function(result){
      if(!result.isError){
        $('.queModal').css('display','none')
        localStorage.setItem(`${obj[result.actionEnum]}_result`,JSON.stringify(result))
        location.href = `/${obj[result.actionEnum]}?query=${result.query}`
      }
      else{
        $('.con,.listening,.unknown').css('display','none')
        if(result.actionEnum=='CONGESTION_UNKNOWN_PLACE'){ 
          $('.density_none').css('display','block').find('.density_click').click(function(){
            $('.density_none').css('display','none')
            location.href =`/density`;
          });
        }else{
          $('.unknown').html(result.msg).css('display','block')
        }
      }
    },
    error:function(textStatus){
      if(textStatus=='timeout'){
        $('.timeOut').css("display","block");
      }
    }
  })
}

document.getElementById('startRecord').addEventListener('touchstart',(e)=>{
  e.preventDefault()
  $('.con').css('display','block')
  $('.listening').css('display','none')
  $('.unknown').css('display','none')
  $('.density_none').css('display','none')
  //调试
  $('#app').html(renderWave()).fadeIn(()=>{
    interval = setInterval(()=>{
      $('#app').html(renderWave())
    },130);
   })
  // GWJSBridge.setup(function(bridge) {
  //   $('#app').html(renderWave()).fadeIn(()=>{
  //     bridge.callHandler('start', {}, cb);
  //     interval = setInterval(()=>{
  //       $('#app').html(renderWave())
  //     },130);
  //    })
  // });

},false)

document.getElementById('startRecord').addEventListener('touchend',(e)=>{
  e.preventDefault()
  clearInterval(interval)
  //调试
  $('#app').fadeOut()
  // GWJSBridge.setup(function(bridge) {
  //   $('#app').fadeOut(()=>{
  //     bridge.callHandler('end', {}, cb);
  //   })
  // });
},false)
