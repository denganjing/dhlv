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
$('.search .cha_img img').click(()=>{
  $('.search input').val('')
})
$('.speak_img').on('click',()=>{
  $('.queModal').css('display','block');
})
$('.queModal').on('click','.close',()=>{
  $('.unknown').css('display','none')
  $('.queModal').css('display',"none");
  $('.con').css('display','block')
})

$('.search input').on('change',()=>{
  var val = $('.search input').val()
  $('.unknown').css('display','none')
  $('.con').css('display','none')
  $('.density_none').css('display','none')
  $('.listening').css('display','block')
  $('.queModal').css('display','block')

  $.ajax({
    type: "get",
    url:'/ai/recommend',
    data: {
      query:val,
      latlng:`${window.lat},${window.lng}`
    },
    dataType: 'json',
    success: function(result){
      if(!result.isError){
        $('.queModal').css('display','none')
        localStorage.setItem(`${obj[result.actionEnum]}_result`,JSON.stringify(result))
        location.href = `/${obj[result.actionEnum]}?query=${result.query}`
      }else{
        $('.con,.listening,.unknown').css('display','none')
        if(result.actionEnum=='CONGESTION_UNKNOWN_PLACE'){ 
          $('.density_none').css('display','block').find('.density_click').click(function(){
            $('.density_none').css('display','none')
            location.href =`/density`;
          });
        }
        else{
          $('.unknown').html(result.msg).css('display','block')
        }
      }
    }
  })
})