 option = {
    title: {
        text: '今日实时人流',
        subtext: '2016-12-12',
        padding: [20,20,10,30],
    },
    grid:{
        width:parseInt($('#density').css('width'))*0.85,
        height:'80%',
        borderWidth:2,
        borderColor:"#979FA8"
      },
    tooltip: {},
    legend: {
        width:'20px',
        padding:[15,16,15,20],
        data:['']
    },
    yAxis: {
        type : 'category',
        axisTick : {show: false},
        data: ["郊野道","郊野道","郊野道","郊野道","郊野道","郊野道"]
    },
    xAxis : {
        type : 'value',
        axisLine:{
          lineStyle:{
            color:'#979FA8',
            width:1
          }
        },
        axisTick : {show: false},
        data : ['1000','10000','20000']
        },
    series: {
        name: '人数',
        type: 'bar',
        barWidth:'20px',
        barCategoryGap:'15px',
        barGap:'15px',
        itemStyle:{
            normal:{
                color:'#D7E9FF',
                barBorderRadius:[0,10,10,0]
            }
        },
        label: {
                normal: {
                    show: true,
                    position: 'inside',
                    textColor:"#222222"
                }
            },
        data: [500, 2000, 3600, 1000, 1000, 20000]
    },
    paralleAxis:{
        axisLine:{
            show: true,
            lineStyle:{
                color:'#979FA8',
                width:1,
                type:'solid',
                opacity: 0.5
            }
        },
        axisTick:{
            show: false
        }
    }
};