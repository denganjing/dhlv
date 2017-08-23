import micro from '../common/micro'

window.lat = 30.567554
window.lng = 114.375306
var touchmove;

const Qus = function(){
  this.params = {}
  let queryArr = location.search.substring(1).split('&')
  for(var i=0;i<queryArr.length;i++){
    this.params[queryArr[i].split('=')[0]] = decodeURIComponent(queryArr[i].split('=')[1])
  }
  $('.search input').val(this.params.query)
  this.getAnswer()
}

Qus.prototype.getAnswer = function() {
  var self = this
  if(this.params.id){
    $.ajax({
      type: "GET",
      url:'/ai/getFaqById',
      data: {
        id : this.params.id,
      },
      dataType: 'json',
      success: function(result){
        self.renderDetail(result)
      }
    })
  }else{
    $.ajax({
      type: "GET",
      url:'/ai/recommendByID',
      data: {
        queryId : this.params.queryId,
        latlng:`${window.lat},${window.lng}`
      },
      dataType: 'json',
      success: function(result){
        self.renderDetail(result)
      }
    })
  }
};

Qus.prototype.renderDetail = function(result){
  var self = this;
  if(result.actionEnum=='FAQ_RECOMMEND'){
    $('.content_top').css('display','block');
    $('.similar').css('display','block');
    $('.where').html(result.data.title);
    $('.time').html(result.data.createTime);
    $('.ans_con').html(result.data.answer);
    var str = ''
    for(var i=0;i<result.data.similarQuestionDOList.length;i++){
      str= `${str}<div class='que' data-id=${result.data.similarQuestionDOList[i].id}>${result.data.similarQuestionDOList[i].title}</div>`
    }
    $('.similarQus').html(str)
  }
};
$('.similarQus').on('touchstart','.que',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#F8F8F8')
});
$('.similarQus').on('touchend','.que',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#FFFFFF')
  if(!touchmove){
    var similarId=$(e.currentTarget).attr('data-id');
    location.href=`qus?id=${similarId}`;
  }
  touchmove=false
});
$('.similarQus').on('touchmove','.que',()=>{
  touchmove = true
});

let qus = new Qus()
// (function(){
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       let qus = new Qus()
//     })
//   })
// })()
