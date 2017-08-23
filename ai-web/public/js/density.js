import micro from '../common/micro'

window.lat = 30.567554;
window.lng = 114.375306;
var touchmove

var date = new Date()
var month = (date.getMonth()==12)
  ? '01'
  : (date.getMonth()+1)>9
  ? (date.getMonth()+1)
  : '0'+(date.getMonth()+1)
var date = date.getFullYear()+'-'+ month + '-' + date.getDate()
$('.time').html(date)

var query={};
let queryArr = location.search.substring(1).split('&')
for(var i=0;i<queryArr.length;i++){
  query[queryArr[i].split('=')[0]] = decodeURIComponent(queryArr[i].split('=')[1])
}

//颜色列表
var colorArr = ['#20D664','#7FE5B0','#2F69FF','#5C9FFF','#FF9446'];
$('.goto').on('click',()=>{
  location.href=`/density`
})
// echart单个景区分表
var option = {
  grid:{
    x:40,
    y:35,
    height:'70%'
  },
  xAxis : {
    axisLabel:{
      textStyle:{
        color:'#979FA8'
      }
    },
    axisLine:{
      lineStyle:{
        color:'#979FA8',
        width:1
      }
    },
    data : []
  },
  yAxis :{
    name : '指数',
    axisLabel:{
      textStyle:{
        color:'#979FA8'
      }
    },
    axisLine:{
      lineStyle:{
        color:'#979FA8',
        width:1
      }
    },
    splitLine: {
      show: false
    },
    min:0
  },
  visualMap: {
    top: 10,
    right: 10,
    show:false,
    pieces: [],
    outOfRange: {
      color: '#999'
    }
  },
  series : {
    type: 'line',
    data: [],
    markLine: {
      silent: true,
      symbol:'none',
      label:{normal:{position:'middle'}},
      data: []
    }
  }
};
//  echart全部景区总表
var option1 = {
      calculable : true,
      grid:{
        containLabel:true,
        x:10,
        y:30,
        width:'82%',
        height:'90%'
      },
      xAxis : [
          {
          axisLine:{
            lineStyle:{
              color:'#979FA8',
              width:1
            }
          },
            type : 'value',
            max : 'auto',
            name : '指数',
            min : 0

          },
      ],
      yAxis : [
           {
              axisLine:{
                lineStyle:{
                  color:'#979FA8',
                  width:1
                }
              },
              type : 'category',
              data : []
          }
      ],
      series : [
          {
              type:'bar',
              // barBorderRadius: [0,5,5,0],
              data:[],
              barWidth:'12px',
              itemStyle:{
                 normal:{
                   color:'#61a0ff',
                   barBorderRadius: [0,10,10,0]
                 }
              },
              markLine : {
                  symbol:'none',
                  data : []
              }
          }
      ]
  };
//最小值计算
function sortNum(a,b){
  return a-b
};

// 下拉菜单部分的事件
$('.selectlist').click(function(){
   $('.container').css('display','block');
   if($('.subnav').css('bottom')!='0px')
    $('.subnav').animate({'bottom':0});
});
// $('.container').on('touchstart',(e)=>{
//   e.preventDefault()
// })
//下拉菜单点击事件
$('.subnav').on('touchstart','p',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#F8F8F8')
});
$('.subnav').on('touchend','p',(e)=>{
  e.stopPropagation()
  $(e.currentTarget).css('background','#ffffff')
  if(!touchmove){
    var li_name=$(e.currentTarget).attr('name');
    $('.find_word').html('您现在看的是：');
    if(li_name=='全部景区'){
      location.href=`/density`
    }else{
      $('.all').css('display','none');
      $('.single').css('display','block');
      $('#density,#predict').css('width',$('.single').innerWidth())
      $.ajax({
      type: "GET",
      url:'/ai/getCongestionByName',
      data: {
        name: li_name
      },
      dataType: 'json',
      success: function(result){
        renderSingle(result);
        $('.subnav').animate({'bottom':'-50%'});
        $('.container').css('display','none');
        }
      });
    }
  }
  touchmove=false
});
$('.subnav').on('touchmove','p',(e)=>{
  e.stopPropagation()
  touchmove = true
})
$('.subnav').on('click','.shrink',()=>{
  $('.subnav').animate({'bottom':'-50%'});
  $('.container').css('display','none');
});
$('.container').on('click',(e)=>{
  // e.preventDefault()
  $('.subnav').animate({'bottom':'-50%'});
  $('.container').css('display','none');
})
/*地图渲染*/
function renderMap(latlng,name){
  var str='', names='';
  var map = new AMap.Map('map',{
    resizeEnable: false,
    zoomEnable:false,
    dragEnable:false
  })
  var str='', names='';
  var markers=[];
  for(var i=0;i<latlng.length;i++){
    var lat = latlng[i].split(',')[0];
    var lng = latlng[i].split(',')[1];
    str = str + latlng[i] + '|'
    names = names + name[i] + '|'
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
  map.setFitView();
  for(var j in markers){
    markers[j].on('click',()=>{
      location.href = `/map?latlng=${str}&names=${names}`
    });
  }
};
// 景区选择列表渲染
function renderList(){
  $.ajax({
    type: "GET",
    url:'/ai/getCongestionDimScenicList',
    dataType: 'json',
    success: function(result){
      var str=`<p class='top_all' name="全部景区">全部景区</p>`;
      for(var i=0;i<result.data.length;i++){
      str+=`<p name=${result.data[i]}>${result.data[i]}</p>`;
      }
      $('.subnav div').html(str);
      $('.subnav p').on('click',(e)=>{
        e.stopPropagation()
      })
    }
  });
}
/*判断地址入口*/ 
function renderChart(){
  if(query.hasOwnProperty("queryId")){
    $('.single').css('display','block');
    $('#density,#predict').css('width',$('.single').innerWidth())
    $('.all').css('display','none');
    $.ajax({
      type: "GET",
      url:'/ai/recommendByID',
      data: {
        queryId: query.queryId,
        latlng : `${window.lat},${window.lng}`
      },
      dataType: 'json',
      success: function(result){
        renderList();
        $('.find_word').html('您现在看的是：');
        renderSingle(result);
        $('.top_result').css('display','block')
        }
      });
    }else if(query.hasOwnProperty('query')){
      $('.single').css('display','block');
      $('#density,#predict').css('width',$('.single').innerWidth())
      $('.all').css('display','none');
      var result = JSON.parse(localStorage.getItem('density_result'))
      $('.find_word').html('您可能想找：');
      renderList();
      renderSingle(result);
      $('.top_result').css('display','block') 
    }
    else{
      $('.single').css('display','none');
      $('.all').css('display','block'); 
      $('#chartAll').css('width',$('.all').innerWidth())
      // 图形渲染            
      $.ajax({
        type:'GET',
        url:'/ai/getCongestionGather',
        dataType:'json',
        success:function(result){
           renderList();
           renderAll(result);
        $('.top_result').css('display','block')
        }
      });
    }
};
// 总的人流图表渲染
function renderAll(result){
  $('.find_word').html('您现在看的是：');
  $('.result_n').html("东湖绿道");
  var latlng = [],name=[];
  var discretizeMap=result.data.discretizeMap;
  var gatherMap=result.data.gatherMap;
  var arr5=[],arr6=['非常舒适','舒适','一般','拥挤','非常拥挤'],arr3=[];
  //arr5是景区名称数组，arr6是舒适度名称数组,arr3是舒适度数值
  for(var i in gatherMap){
      arr5.push(i);
  }
  for(var j=0;j<arr6.length;j++){
     arr3.push(discretizeMap[arr6[j]]);
  }
  arr3.sort(sortNum);
  for(var i=0;i<5;i++){
    latlng.push(gatherMap[arr5[i]].latlng);
    name.push(gatherMap[arr5[i]].name);
    option1.yAxis[0].data.unshift(arr5[i]);
    option1.series[0].data.unshift(gatherMap[arr5[i]].congestionIndex);
  };
  renderMap(latlng,name);

  var arr4=option1.series[0].data;
  arr4.sort(sortNum);
  if(arr4[arr4.length-1]<arr3[0]){
     option1.series[0].markLine.data = []
     option1.xAxis[0].max=arr3[0];

     option1.series[0].markLine.data.push({
        xAxis:arr3[0],
        name:"非常舒适",
        lineStyle:{normal:{color:colorArr[0]}},
        label:{
          normal:{
            show:true,
            formatter:'{b}',
            textStyle:{
                color:colorArr[0]
            }
          }
        }
    });
  }else{
      option1.series[0].markLine.data = []
        for(var i=0;i<arr3.length;i++){
          option1.series[0].markLine.data.push({
            xAxis:discretizeMap[arr6[i]],
            name:arr6[i],
            lineStyle:{normal:{color:colorArr[i]}},
            label:{
              normal:{
                show:true,
                formatter:'{b}',
                textStyle:{
                    color:colorArr[i]
                }
              }
            }
          });
        }
      }
  $('.alltitle .time').html("2017-01-01")
  var ChartAll=echarts.init(document.getElementById('chartAll'));
  ChartAll.setOption(option1);
}
// 单个景区人流图表渲染
function renderSingle(result){
  var myChart = echarts.init(document.getElementById('density'));
  var myChart2 = echarts.init(document.getElementById('predict'));
  $('.single').css('display','block')
  $('.search input').val(result.query)
  $('.result_n').html(result.data.name)
  if(!result.isError){
    renderMap([result.data.latlng],[result.data.name])
    var arr1 = []
    var arr2 = []
    var arr4 = []
    var arr5 = []

    var scenicCongestionDiscretizeS = result.data.scenicCongestionDiscretizeS
    for(var i in scenicCongestionDiscretizeS){
      arr1.push(i)
      arr2.push(scenicCongestionDiscretizeS[i])
    }

    for(var i=0;i<arr1.length;i++){
      option.visualMap.pieces.push({
        gt: parseInt((i!=0)?arr1[i-1]:0),
        lte: parseInt(arr1[i]),
        color:'#61a0ff'
      })
    }
    for(var kk=0;kk<result.data.predictData.length;kk++){
      arr4.push(result.data.predictData[kk])
    }
    for(var kk=0;kk<result.data.waringData.length;kk++){
      arr5.push(result.data.waringData[kk])
    }

    arr4.sort(sortNum);
    arr5.sort(sortNum);
    if(parseInt(arr5[arr5.length-1])<parseInt(arr1[0])){
      option.series.markLine.data = []

      option.yAxis.max=parseInt(arr1[0]);

      option.series.markLine.data.push({
        yAxis:arr1[0],
        lineStyle:{normal:{color:colorArr[0]}},
        label:{
          normal:{
           textStyle:{
             color:colorArr[0]
           },
           position:'middle',
           formatter:"非常舒适"
          }
        }
     });
    }
    else{
      option.series.markLine.data = []
      option.yAxis.max='auto';

      for(var i=0;i<arr1.length;i++){
        option.series.markLine.data.push({
          yAxis: arr1[i],
          lineStyle:{normal:{color:colorArr[i]}},
          label:{
            normal:{
              textStyle:{
                color:colorArr[i]
              },
              position:'middle',
              formatter:arr2[i]
            }
          }
        })
       };
    }
    option.xAxis.data = result.data.waringTime
    option.series.data = result.data.waringData
    myChart.setOption(option)

    if(parseInt(arr4[arr4.length-1])<parseInt(arr1[0])){
      option.series.markLine.data = []

      option.yAxis.max=parseInt(arr1[0]);

      option.series.markLine.data.push({
        yAxis:arr1[0],
        lineStyle:{normal:{color:colorArr[0]}},
        label:{
          normal:{
           textStyle:{
             color:colorArr[0]
           },
           position:'middle',
           formatter:"非常舒适"
          }
        }
     });
    }
    else{
      option.series.markLine.data = []
      option.yAxis.max='auto';

      for(var i=0;i<arr1.length;i++){
        option.series.markLine.data.push({
          yAxis: arr1[i],
          lineStyle:{normal:{color:colorArr[i]}},
          label:{
            normal:{
              textStyle:{
                color:colorArr[i]
              },
              position:'middle',
              formatter:arr2[i]
            }
          }
        })
       };
    }
    option.xAxis.data = result.data.predictTime
    option.series.data = result.data.predictData
    myChart2.setOption(option)
 }else{
    $('.box').css('display','none')
    $('.modal').html(result.msg)
 }
}

renderChart()
// (function() {
//   var position, latitude, longitude;
//   GWJSBridge.setup(function(bridge) {
//     bridge.callHandler('getCurrentPosition', {}, function(data) {
//       window.lat = data.result.latitude
//       window.lng = data.result.longitude
//       renderChart()
//      });
//   });
// })()
