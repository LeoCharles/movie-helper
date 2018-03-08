// 将豆瓣电影评分 转成[1,1,1,0,0]这样的数组
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var half = stars.toString().substring(1);
  var array = [];
  for(var i = 0; i <= 4; i++) {
    if(i < num ) {
      array.push(1);
    } else if (i == num) {
      // 半星 转成[1,1,1,5,0]
      half === '5' ? array.push(5) : array.push(0);
    } else {
      array.push(0);
    }
  }
  return array;
}

// 将演员表数组用'/'分隔
function convertToCastString(casts) {
  var castsjoin = '';
  casts.forEach(function(item, idx) {
    castsjoin += item.name + ' / ';
  })
  return castsjoin.substring(0, castsjoin.length-2);
}

// 演员图片、名称
function convertToCastInfo(casts) {
  var castsArray = [];
  casts.forEach(function (item, idx) {
    var cast = {
      img: item.avatars ? item.avatars.large : '',
      name: item.name
    };
    castsArray.push(cast);
  })
  return castsArray;
}

// 网络请求
function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'json'
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (err) {
      console.log(err);
    }
  })
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  convertToCastString: convertToCastString,
  convertToCastInfo: convertToCastInfo,
  http: http
}