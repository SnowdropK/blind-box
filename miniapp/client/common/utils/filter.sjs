var formatAwardType = function (n) {
  if (n) {
    if (n.indexOf('DE_FIRST') != -1) return '雷王FIRST'
    else if (n.indexOf('DE_ALL') != -1) return '雷王全局赏'
    else if (n.indexOf('DE_LAST') != -1) return '雷王LAST'
    else if (n.indexOf('CSP_') != -1) return '拳王赏'
    else {
      return n.indexOf('CJ_') !== -1 ? '全局赏' : n
    }
  } else return n
}

var formatAwardTypeImg = function (n) {
  // console.log(n);
  if (n == 'FIRST') return 'f'
  else if (n == 'LAST') return 'l'
  else if (n.indexOf('CJ_') !== -1) return 'all'
  else if (n == 'A' || n == 'SP') return 'a'
  else if (n.indexOf('DE_') !== -1) return 'f'
  else return 'b'
}

// 中赏弹窗边框样式
var formatAwardTypeBoxImg = function (n) {
  if (n.indexOf('魔王') !== -1) return 'https://chujiangupload.xingyunyfs.com/tb-static/special-img/reward/mw-min.gif'
  else if (n.indexOf('超神') !== -1) return 'https://chujiangupload.xingyunyfs.com/tb-static/special-img/reward/cs-min.gif'
  else if (n.indexOf('欧皇') !== -1) return ' https://chujiangupload.xingyunyfs.com/tb-static/special-img/reward/oh-min.gif'
  else if (n == 'SP') return 'https://chujiangupload.xingyunyfs.com/tb-static/special-img/reward/sp-min.gif'
  else return 'b'
}

var list = ['UR', 'SSR', 'SR', 'R', 'N']
var formatAwardTypeBox = function (n) {
  if (!n) return
  if (list.indexOf(n) !== -1) return n
  else return 'N'
}
// 过滤出赏边框
var formatAwardNameBox = function (n) {
  if (!n) return
  var listImg = [
    {
      border: 'https://chujiangupload.xingyunyfs.com/user_1/1657761422744096768.gif',
      bg: 'https://chujiangupload.xingyunyfs.com/user_1/1657333984713117696.png',
    }, {
      border: 'https://chujiangupload.xingyunyfs.com/user_1/1657761361066856448.gif',
      bg: 'https://chujiangupload.xingyunyfs.com/user_1/1657334058365095936.png',
    }, {
      border: 'https://chujiangupload.xingyunyfs.com/user_1/1657761300417220608.gif',
      bg: 'https://chujiangupload.xingyunyfs.com/user_1/1657332311819161600.png',
    }, {
      border: 'https://chujiangupload.xingyunyfs.com/user_1/1657761225012023296.gif',
      bg: 'https://chujiangupload.xingyunyfs.com/user_1/1657332444770209792.png',
    }, {
      border: '',
      bg: 'https://chujiangupload.xingyunyfs.com/user_1/1657332528752758784.png'
    },
  ]
  if (list.indexOf(n) !== -1) {
    return listImg[list.indexOf(n)]
  }
  else return listImg[4]
}

var formatAwardTypeWord = function (n) {
  // console.log(n);
  // 旧
  // if (!n || n == 'FIRST' || n == 'LAST' || n.indexOf('CJ_') !== -1) return ''
  // 新ui
  if (!n ) return ''
  else if (n == 'FIRST' || n == 'LAST') return n
  else if (n.indexOf('CJ_') !== -1) return '全局赏'
  else if (n == 'DE_FIRST') return '雷王FIRST'
  else if (n == 'DE_ALL') return '雷王全局赏'
  else if (n == 'DE_LAST') return '雷王LAST'
  else return n + '赏'
}

var formatCouponType = function (n) {
  if (n === '新用户券' || n === 'R') return 'N'
  else return n
}

var formatCouponName = function (n) {
  if (n === 'CC') return 'C级合成券'
  else if (n === '新用户券' || n === 'R') return '新用户券'
  else return n + '级初酱券'
}

var formatRewardType = function (n) {
  if (n == 0) return '一番赏'
  else if (n == 1) return '双随机'
  else if (n == 2) return '全局赏'
  else if (n == 3) return '无限赏'
}

var formatTime = function (n) {
  if(n > 9) return n
  else return '0'+n
}

export default {
  formatAwardTypeWord: formatAwardTypeWord,
  formatAwardTypeImg: formatAwardTypeImg,
  formatAwardTypeBoxImg: formatAwardTypeBoxImg,
  formatAwardTypeBox: formatAwardTypeBox,
  formatAwardNameBox: formatAwardNameBox,
  formatAwardType: formatAwardType,
  formatCouponType: formatCouponType,
  formatCouponName: formatCouponName,
  formatRewardType: formatRewardType,
  formatTime: formatTime
};
