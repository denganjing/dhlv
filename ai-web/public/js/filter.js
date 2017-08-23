window.lat = 30.567554;
window.lng = 114.375306;

function render(){
	$.ajax({
		type:"GET",
	    url:`/ai/travelScenicList`,
	    dataType: 'json',
	    success:function(result){
	    	let str2=``;
	    	let listName=[];
	    	for(var j in result.data){
                listName.push(j);
	    	}
	    	for(var i=0;i<10;i++){
                str2+=`<li id=${result.data[listName[i]].id}>
			              <img class='list_img' src=${result.data[listName[i]].imgUrl} />
			              <div class="text">
			                <h5>${listName[i]}</h5>
			                <p class="intro">${result.data[listName[i]].briefIntroduction}<p>
			                <span class="detail" need=${result.data[listName[i]].id}>详情&nbsp;></span>
			              </div>
			              <section class="cover"><img src="/imgs/ok.png" /></section>
			            </li>`;
	    	}
	    	$('.list_con ul').html(str2);
        $('.list_con .sk-fading-circle').css('display','none')
        $('.list_con ul').css('display','block')
        check();
	    }
	})
}

//检测是否满足提交条件
function check(){
	//button的选择事件
	$('li:eq(1) button').click(function(){
		$(this).parent().children("button").removeClass('currentB');
		$(this).addClass('currentB');
	});

	$('.list_con li').click(function(){
		$(this).find('.cover').toggle();

		//检测点击数量不可以超过三个
		if(($('.list_con section:visible').length)>3){
			$(this).find('.cover').toggle();
			$('.check_scenic').show();
		}else{
           $('.check_scenic').hide();
		}
	});
	$('.list_con .detail').click(function(e){
		e.stopPropagation();
		var need=$(this).attr('need');
		location.href=`recommend?domain=scenic&id=${need}`;
	})
	let time1,time2,time3;

	//将日期改为当前日期
	var now=new Date();
	var year=now.getFullYear(),
	    month=now.getMonth()+1,
	    day=now.getDate(),
	    hour=now.getHours(),
	    minute=now.getMinutes(),
	    month1=month,
	    day1=day;
	if (month >= 1 && month <= 9) {
    month1 = "0" + month;
  }
  if (day>= 0 && day <= 9) {
    day1 = "0" + day;
  }
	$('#appDateTime').val(year+'-'+month1+'-'+day1);

  time1=$('#appDateTime').val();
  if(hour<10){
    $('#appTime').val('0'+hour+':00');
  }else{
    $('#appTime').val(hour+':00');
    $('#appTimeEnd').val(hour+1+':00');
  }
  var hour2 = hour+3
  if(hour2<10){
    $('#appTimeEnd').val('0'+hour2+':00');
  }else if(hour2<24){
    $('#appTimeEnd').val(hour2+':00');
  }else{
    $('#appTimeEnd').val('23:00');
  }
  if(hour==23){
    $('.time1 .check1').css('display','block');
  }

  //时间检测，结束时间不可小于出发时间
	$('.time1 input').change(function(){
		time1=$('#appDateTime').val();
	    time2=$('#appTime').val();
	    time3=$('#appTimeEnd').val();
	    if(time2!='请选择'&&time3!="请选择"){
	    	$('.time1 .check2').css("display",'none');
	        let t2arr=time2.split(':');
	        let t3arr=time3.split(':');
	        if(parseInt(t2arr[0])>=parseInt(t3arr[0])){
	         $('.time1 .check1').css('display','block');
	         $('.product button').attr('disabled','true');
	        }else{
	        	$('.time1 .check1').css('display','none');
	        	$('.product button').removeAttr('disabled');
	        }
	    }else{
	    	$('.time1 .check2').css("display",'block');
	    }
	});

	//提交按钮的点击事件
	$('.product button').click(function(){
    if($('.check1').css('display')=='block'){
      return
    }
		var t0,t1;
    //t1为开始时间，t1为不选推荐景区时的结束时间，t2为选择推荐景区时的结束时间
		t0=new Date().getTime();
		$('.loading').show();
		time1=$('#appDateTime').val();
    time2=$('#appTime').val();
    time3=$('#appTimeEnd').val();
		let btns=[];
		var type=$('.filterList li:eq(1) button[class="currentB"]').attr('level');
		$('.list_con section:visible').each(function(){
		  let btnVal=$(this).parent().attr('id');
      btns.push(btnVal);
		});

		//*********提取ajax中的检测result是否正确的函数
		function checkError(result){
    		$('.submit').html(result.msg);
	    	if(result.isError){
	    	    $('.loading').hide();
	    		$('.submit_container').fadeIn(()=>{
			        setTimeout(()=>{
			          $('.submit_container').fadeOut()
			        },2000)
			    });
	    	}else{
		    	var travelPlan=result;
                travelPlan=JSON.stringify(travelPlan);
                localStorage.setItem('travelPlan',travelPlan);
                t1=new Date().getTime();
                var t2=t1-t0;
                if(t2>=2000){         //检测花费时间是否大于2秒
                  location.href=`/path`;	
	    		  $('.loading').hide();
                }else{               //大于2秒则定时跳转
                  setTimeout(()=>{
                  	location.href=`/path`;	
	    		    $('.loading').hide();
                  },2000-t2);
                }
            }
    	};


		//检测是否点击了推荐景区列表
    if(btns.length==0){
      var startTime = parseInt(time2)<10?('0'+parseInt(time2)):(''+parseInt(time2))
      var endTime = parseInt(time3)<10?('0'+parseInt(time3)):(''+parseInt(time3))

    	var data =JSON.stringify({
	    	startTime: startTime,
	    	endTime: endTime,
	    	date: time1,
	    	strength:type,
	    	preferScenicIDs:[],
	    	latlng : `${window.lat},${window.lng}`
	    })
    	$.ajax({
  	    type:"GET",
  	    url:`/ai/travelPlan`,
  	    data:data,
  	    dataType: 'json',
  	    success:function(result){
    	    checkError(result);
	    	}
	    });
    }else{
      var startTime = parseInt(time2)<10?('0'+parseInt(time2)):(''+parseInt(time2))
      var endTime = parseInt(time3)<10?('0'+parseInt(time3)):(''+parseInt(time3))

    	var data =JSON.stringify({
	    	startTime: startTime,
	    	endTime: endTime,
	    	date: time1,
	    	strength:type,
	    	preferScenicIDs:btns,
	    	latlng : `${window.lat},${window.lng}`
	    })
    	$.ajax({
		    type:"GET",
		    url:`/ai/travelPlan`,
		    data:data,
		    dataType: 'json',
		    success:function(result){
    	    checkError(result);
        }
	    });
    }
  });
}

render();
// (function() {
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       render();
//      });
//   });
// })()
