var express = require('express');
var router = express.Router();
const request = require('request');
var ip = '139.224.6.31';

router.get('/' , function(req,res){
  res.render("home");
});
router.use('/home',function(req,res){
  res.render('home');
});
router.use('/weather',function(req,res){
  res.render('weather');
});
router.use('/qus',function(req,res){
  res.render('qus');
});
router.use('/recommend',function(req,res){
  res.render('recommend');
});
router.use('/detail',function(req,res){
  res.render('detail');
});
router.use('/food',function(req,res){
  res.render('food');
});
router.use('/density',function(req,res){
  res.render('density');
});
router.use('/map',function(req,res){
  res.render('map');
});
router.use('/poi',function(req,res){
  res.render('poi');
});
router.use('/faq',function(req,res){
  res.render('faq');
})
router.use('/filter',function(req,res){
  res.render('filter');
});
router.use('/path',function(req,res){
  res.render('path');
})
/**
 * 健康检查
**/
router.use('/health' , function(req,res){
  return res.json({
    "status":"UP"
  })
})

router.use('/ai/getRecommend',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/getRecommend',
    method: 'POST',
    json:true,
    body: qs
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})

router.use('/ai/getHotelById',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    url:'http://'+ip+'/ai/getHotelById',
    qs:qs,
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    }
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/getScenicById',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url:'http://'+ip+'/ai/getScenicById',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})
router.use('/ai/getRestaurantById',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    url:'http://'+ip+'/ai/getRestaurantById',
    qs:qs,
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    }
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})
router.use('/ai/getCommentGather',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url:'http://'+ip+'/ai/getCommentGather',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/getCommentDetail',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url:'http://'+ip+'/ai/getCommentDetail',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/publicService',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  request({
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWFp'
    },
    headers: {"Connection": "close"},
    url: 'http://'+ip+'/ai/publicService',
    method: 'POST',
    json:true,
    body: qs
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})

router.use('/ai/faqService',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  request({
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWFp'
    },
    headers: {"Connection": "close"},
    url: 'http://'+ip+'/ai/faqService',
    method: 'POST',
    json:true,
    body: qs
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})

router.use('/ai/getFaqById',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWFp'
    },
    url:'http://'+ip+'/ai/getFaqById',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/getScenicCongestionWarning',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWFp'
    },
    url:'http://'+ip+'/ai/getScenicCongestionWarning',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/getScenicCongestionPredict',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWFp'
    },
    url:'http://'+ip+'/ai/getScenicCongestionPredict',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/getDiscretizeByScenic',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWFp'
    },
    url:'http://'+ip+'/ai/getDiscretizeByScenic',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/getPoi',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWFp'
    },
    url:'http://'+ip+'/ai/getPoi',
    qs:qs
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/nlu',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/nlu',
    method: 'POST',
    json:true,
    body: qs
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})

router.use('/ai/recommend',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/recommend',
    method: 'POST',
    json:true,
    body: qs
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})

 router.use('/ai/recommendByID',function(req,res){
  var params = req._parsedUrl.query.split('&')
  var qs={}
  for(var i=0;i<params.length;i++){
    qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
  }
  var options = {
    url:'http://'+ip+'/ai/recommendByID',
    qs:qs,
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    }
  }
  request.get(options, function(error, response, body){
    res.send(JSON.parse(body))
  })
})

router.use('/ai/listQuery',function(req,res){
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/listQuery',
    method: 'GET',
    json:true
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})
router.use('/ai/getCongestionDimScenicList',function(req,res){
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/getCongestionDimScenicList',
    method: 'GET',
    json:true
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})
router.use('/ai/getCongestionGather',function(req,res){
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/getCongestionGather',
    method: 'GET',
    json:true
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})
router.use('/ai/getCongestionByName',function(req,res){
    var params = req._parsedUrl.query.split('&')
    var qs={}
    for(var i=0;i<params.length;i++){
      qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
    }
   request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/getCongestionByName',
    method: 'GET',
    qs:qs,
    json:true
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
})

// 行程规划
router.use('/ai/travelPlan',function(req,res){
  var params = JSON.parse(decodeURIComponent(req._parsedUrl.query))
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/travelPlan',
    method: 'POST',
    json:true,
    body: params
  }, function(error, response, data){
    if (!error) {
      res.end(JSON.stringify(data))
    }
  });
});

router.use('/ai/uploadQuestion',function(req,res){
    var params = req._parsedUrl.query.split('&')
    var qs={}
    for(var i=0;i<params.length;i++){
      qs[params[i].split('=')[0]] = decodeURIComponent(params[i].split('=')[1])
    }
   request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/uploadQuestion',
    method: 'POST',
    qs:qs,
    json:true
  }, function(error, response, data){
    if (!error) {
      res.end(JSON.stringify(data))
    }
  });
})

//按钮里的景区推荐列表
router.use('/ai/travelScenicList',function(req,res){
  request({
    headers: {"Connection": "close"},
    auth: {
      user: 'user-lvyou-ai',
      pass: 'pass-lvyou-ai',
      basic:'Basic dXNlci1sdnlvdS1haTpwYXNzLWx2eW91LWE'
    },
    url: 'http://'+ip+'/ai/travelScenicList',
    method: 'GET',
    json:true
  }, function(error, response, data){
    if (!error && response.statusCode == 200) {
      res.end(JSON.stringify(data))
    }
  });
});

module.exports = router;
