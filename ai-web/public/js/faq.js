import micro from '../common/micro'

window.lat = 30.567554;
window.lng = 114.375306;
var touchmove;
var address = {}
let queryArr = location.search.substring(1).split('&')
for(var i=0;i<queryArr.length;i++){
  address[queryArr[i].split('=')[0]] = decodeURIComponent(queryArr[i].split('=')[1])
}
$('.ask_container input').focus(()=>{
  $('body').css('bottom',$('.ask_container').innerHeight())
})
$('.ask_container input').change(()=>{
  $('body').css('bottom',0)
})
$('.ask_container input').blur(()=>{
  $('body').css('bottom',0)
})
$('.ask_container .askButton').click(()=>{
  $('body').css('bottom',0)
  var val = $('.ask_container input').val()
  $.ajax({
    type:"GET",
    url:`/ai/uploadQuestion?question=${val}`,
    dataType: 'json',
    timeout:3000,
    success:function(result){
      $('.submit').fadeIn(()=>{
        setTimeout(()=>{
          $('.submit').fadeOut()
        },2000)
      })
    }
  })
})

// 列表点击
$('.listQuery,.hotList').on('touchstart','li',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#F8F8F8')
});
$('.listQuery,.hotList').on('touchend','li',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#ffffff')
  if(!touchmove){
    var listId=$(e.currentTarget).attr('id');
    location.href=`qus?id=${listId}`;
  }
  touchmove=false
});
$('.listQuery,.hotList').on('touchmove','li',()=>{
  touchmove = true
})
function getlist(){
  $('.search input').val(address.query)
  $('.ask_container input').val(address.query)
  var result = JSON.parse(localStorage.getItem('faq_result'))
  var str = ''
  var data=result.data;
  if(data && result.actionEnum != 'FAQ_RECOMMEND_HOT'){
    $('.listQuery').css('display','block');
      for(var i=0;i<data.length;i++){
        str=`${str}<li id=${data[i].id}>`
        var key=data[i].highlightedStrList;
        var txt=data[i].title;
        var answer = data[i].answer.length > 70 ? (data[i].answer.substring(0,67)+'...'):data[i].answer

        for(var j=0;j<key.length;j++){
          var reg=new RegExp(key[j],'g');
          txt=txt.replace(reg,"<strong class='highlight'>"+key[j]+"</strong>"); 
          answer=answer.replace(reg,"<strong class='highlight'>"+key[j]+"</strong>"); 
        }
        var sourcetime = (data[i].sourceDomain && data[i].createTime)
        ? `${data[i].sourceDomain}&nbsp;&nbsp;|&nbsp;&nbsp;${data[i].createTime}`
        : data[i].sourceDomain
        ? `${data[i].sourceDomain}`
        : data[i].createTime
        ? `${data[i].createTime}`
        : ``

        str+=`<div class='listTitle'>${txt}</div>
        <div class='answer'>${answer}</div>
        <div class='sourcetime'>${sourcetime}</div>
        </li>`
        $('.listQuery').html(str);
      }
  }else{
    $('.no_answer_container').css('display','block');
    $('.no_answer_container .msg').html(result.msg);
    for(var i=0;i<data.length;i++){
      var answer = data[i].answer.length > 70 ? (data[i].answer.substring(0,67)+'...'):data[i].answer
      str=`${str}<li id=${data[i].id}>
      <div class='listTitle'>${data[i].title}</div>
      <div class='answer'>${answer}</div></li>`
    }
    $('.hotList').html(str);
  }
};

getlist()
// (function() {
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       getlist()
//      });
//   });
// })()