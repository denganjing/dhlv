import micro from '../common/micro'

function getScore(val){
  var str = ''
  for(var i=0;i<val;i++){
    str = `${str}<img src='imgs/star_light.png' />`
  }
  for(var j=val;j<5;j++){
    str = `${str}<img src='imgs/star_dark.png' />`
  }
  return str
}

let queryArr = location.search.substring(1).split('&')
var params = {}
for(var i=0;i<queryArr.length;i++){
  params[queryArr[i].split('=')[0]] = queryArr[i].split('=')[1]
}
$('.loading').css('display','block')
$.ajax({
	type:"GET",
	url:"/ai/getCommentDetail",
  data: {
    entityId : params.entityId,
    type:params.type,
    keyword:decodeURIComponent(params.keyword),
    pageSize:30,
    pageNum:1
  },
  dataType: 'json',
  timeout:50000,
	success:function(result){
    var str = ''
		var data=result.listData;
    if(data){
      $('.gk').html(`${decodeURIComponent(params.keyword)}<span>${result.listData.length}</span>`)

  		for(var i=0;i<data.length;i++){
        var name = data[i].userName.length>15?(data[i].userName.substr(0,14)+'...'):data[i].userName
        
        var comment =data[i].content.split(' ').join()
        str = `${str}<div class='item'><div><div class="detail_top">
          <div class="pic"></div>
          <span class="name">${name}</span><span class="time">${data[i].time}</span>
          <div class='score'>${getScore(data[i].evaluation)}</div>
        </div>
        <div class="text" str=${comment} keyword=${data[i].associateComment}></div></div></div>`
  		}
      $('.loading').css('display','none')
      $('.talk_detail_1').html(str)
      for(var j=0;j<$('.text').length;j++){
        var hl=$($('.text')[j]).attr('keyword').split(',');
        var comment = $($('.text')[j]).attr('str')
        for(var k=0;k<hl.length;k++){
          var reg = new RegExp(hl[k],"g");
          comment = comment.replace(reg,"<span class='highlight'>"+hl[k]+"</span>"); 
        }
        $($('.text')[j]).html(comment)
      }
  	}
    else{
      $('.loading').css('display','none')
      $('.talk_detail_1').html('未查到相关数据')
    }
  }
})