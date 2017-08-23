import micro from '../common/micro'

window.lat = 30.567554
window.lng = 114.375306

var touchmove;
var obj = {
  'weather':'weather',
  'hotel':'food',
  'scenic':'food',
  'restaurant':'food',
  'unknown':'faq',
  'congestion':'density',
  'poi':'poi',
}
$('.quelist_txt').on('touchstart','p',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#F8F8F8')
});
$('.quelist_txt').on('touchend','p',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#ffffff')
  if(!touchmove){
    var dId=$(e.currentTarget).attr('dId');
    var dadomain=$(e.currentTarget).attr('dadomain');
    var daquery=$(e.currentTarget).attr('daquery');
    if(dadomain=='faq'){
      dadomain='qus';
      location.href=`qus?query=${daquery}&queryId=${dId}`
    }else{
      location.href=`${obj[dadomain]}?query=${daquery}&queryId=${dId}`
    }
  }
  touchmove = false
});
$('.quelist_txt').on('touchmove','p',()=>{
  touchmove = true
})
//首页问题列表
function getFaq(){
  $.ajax({
    type: "GET",
    url:'/ai/listQuery',
    dataType: 'json',
    success: function(result){
      renderListQ(result);
    }
  })
};
// 换一换按钮列表渲染
function renderListQ(result,num){
  var data=result.data;
  var str = ``;
  var index=[0,0,0];
  var j=0,i=1,name;
  var arr1=['.fuwu','.tuijian','.baike'];
  $('.quelist_img li').click(function(){
    name=$('.'+$(this).attr('name'));
    var judge=$(this).attr('class');
    if(judge=='more'){
      $(this).css('height','3.6rem');
      $(this).children('i').css('transform','rotate(-90deg)');
      name.css('height','3.6rem');
      $(this).attr('class','less');
    }else{
      $(this).css('height','1.8rem');
      $(this).children('i').css('transform','rotate(90deg)');
      name.css('height','1.8rem');
      $(this).attr('class','more');
    }
  });
  function loop(){ 
    for(i in data){
      str=``;                       //每num个一循环
      if(data[i].length-index[i-1]<4){
        for(j=index[i-1];j<data[i].length;j++){
        var item=data[i][j];  
        str+=`<p dId=${item.id} dadomain=${item.domain} daquery=${item.query}>${item.query}<img src="/imgs/arroricon.png"></p>`;
        }
        for(j=0;j<4-data[i].length+index[i-1];j++){
          var item=data[i][j];
          // console.log(data,i,j,item)
        str+=`<p dId=${item.id} dadomain=${item.domain} daquery=${item.query}>${item.query}<img src="/imgs/arroricon.png"></p>`;
        }
      }else{
        for(j=index[i-1];j<index[i-1]+4;j++){
          var item=data[i][j];
          str+=`<p dId=${item.id} dadomain=${item.domain} daquery=${item.query}>${item.query}<img src="/imgs/arroricon.png"></p>`;
        }
      }
      index[i-1]=j;
     $(arr1[i-1]).html(str);
     $('.sk-fading-circle').css('display','none')
     $('.questions').css('display','block')
    }
  }  
  loop();
  $(".huanyihuan").click(function(){
   	str=` `;
    for(var i=1;i<4;i++){
      if(index[i-1]>=data[i].length){
        index[i-1]=0;
      }
    }
    loop();
  });
}

getFaq();
// (function() {
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       getFaq();
//      });
//   });
// })()