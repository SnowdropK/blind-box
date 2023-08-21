const urls = {
  // 一番赏
  YIFAN_SHANG: { title: '一番赏玩法说明', url: 'https://chujiangupload.xingyunyfs.com/app_html/admin-upload/%E4%B8%80%E7%95%AA%E8%B5%8F%E7%8E%A9%E6%B3%95.txt'},
  // 双随机
  SHUANGSUIJI: { title: '双随机玩法说明', url: 'https://chujiangupload.xingyunyfs.com/app_html/admin-upload/%E5%8F%8C%E9%9A%8F%E6%9C%BA%E7%8E%A9%E6%B3%95.txt'},
  // 雷王
  LEIWANG: { title: '雷王赏玩法说明', url: 'https://chujiangupload.xingyunyfs.com/app_html/admin-upload/%E9%9B%B7%E7%8E%8B%E8%B5%8F%E7%8E%A9%E6%B3%95.txt'},
  // 全局赏
  QUANJU: { title: '全局赏玩法说明', url: 'https://chujiangupload.xingyunyfs.com/app_html/admin-upload/%E5%85%A8%E5%B1%80%E8%B5%8F%E7%8E%A9%E6%B3%95.txt' },
  // 拳王
  QUANWANG: { title: '拳王赏玩法说明', url: 'https://chujiangupload.xingyunyfs.com/app_html/admin-upload/%E6%8B%B3%E7%8E%8B%E8%B5%8F%E7%8E%A9%E6%B3%95.txt'},
  // 无限赏 || 魔王赏
  WUXIAN_MOWANG: { title: '无限赏 或 魔王赏玩法说明', url: 'https://chujiangupload.xingyunyfs.com/app_html/admin-upload/%E6%97%A0%E9%99%90-%E9%AD%94%E7%8E%8B%E8%B5%8F%E7%8E%A9%E6%B3%95.txt'},
  // 积分
  POINT: {  title: '积分赏玩法说明', url: 'https://chujiangupload.xingyunyfs.com/app_html/admin-upload/%E7%A7%AF%E5%88%86%E8%B5%8F%E7%8E%A9%E6%B3%95.txt' }
}
const getRules = function(ruleNumberObj) {
  const rules = {
    YIFAN_SHANG: {title: '一番赏玩法说明', text: `本箱规则\n1、抽赏规则：X元明信片随机获得一款限定周边（Last赏除外）。X元指的是当前箱子单抽价格。\n2、Last赏规则：购买最后一抽获得Last。`},
    SHUANGSUIJI: {title: '双随机玩法说明', text: 
      `本箱规则
      \n假设本箱总共1000抽：
      \n1、First赏规则：在第500抽售出的同时，由系统在1-500中随机抽取1抽，由此抽的抽取者获得First赏。
      \n2、Last赏规则：在第1000抽售出的同时，由系统在501-1000中随机抽取1抽，由此抽的抽取者获得Last赏。`
    },
    LEIWANG: {title: '雷王赏玩法说明', text: 
      `本箱规则
      \n假设本箱总共1000抽：
      \n1、First赏规则：在第500抽售出的同时，由系统在1-500中随机抽取1抽，由此抽的抽取者获得First赏。
      \n2、Last赏规则：在第1000抽售出的同时，由系统在501-1000中随机抽取1抽，由此抽的抽取者获得Last赏。
      \n3、雷王First赏规则：在第500抽售出的同时，赠送给1-500中抽赏亏损最多的一位玩家。
      \n4、雷王Last赏规则：在第1000抽售出的同时，赠送给501-1000中抽赏亏损最多的一位玩家。
      \n5、雷王全局赏规则：在雷王Last赏送出的同时，赠送给1-1000中抽赏亏损最多的一位玩家。
      \n6、开奖顺序：（SP,A,B,C...Z赏即抽随机得）→ First → 雷王First → Last赏 → 雷王Last赏 → 雷王全局赏`
    },
    QUANJU: {title: '全局赏玩法说明', text: `
    本箱规则
    \n假设本箱总共10抽：
    \n1、全局赏规则：每人限购1抽，在第10抽售出的同时，由系统随机在10抽中选取N抽，由此N抽的抽取者获得全局赏。（由于每1抽均为单独随机，即可能出现1抽对应多个全局赏的情况；）
    \n2、该模式为人满即开型，即参与人数达到设置数量，奖池将全部开奖，参与者可获得一个或多个赠品，也有可能一个都没有，目前程序未设立排队机制，可能会有多人同时下单，下单快会优先，下单失败会退回小程序余额。退款时间存在延迟，请谅解。`
    },
    QUANWANG: {title: '拳王赏玩法说明', text: `
    本箱规则
    \n假设本箱总共10抽：
    \n1、全局赏规则：每人限购1抽，在第10抽售出的同时，由系统随机在10抽中选取N抽，由此N抽的抽取者获得全局赏。（由于每1抽均为单独随机，即可能出现1抽对应多个全局赏的情况；）
    \n2、拳王赏规则：本场同第一条序号对应获得等于 M 个全局赏后可触发拳王赏赏品。若有多位用户达成某个触发条件，则在上述几位用户中，按照购买时间的第一位赠送该拳王赏赏品。M：赏池预览页面 拳王赏的名称上方 "一串" 后面的数字。
    \n3、该模式为人满即开型，即参与人数达到设置数量，奖池将全部开奖，参与者可获得一个或多个赠品，也有可能一个都没有，目前程序未设立排队机制，可能会有多人同时下单，下单快会优先，下单失败会退回小程序余额。退款时间存在延迟，请谅解。   
    `},
    WUXIAN_MOWANG: {title: '无限赏 或 魔王赏玩法说明', text: `
    本箱规则
    \n1、抽赏规则：每抽获得不同赏种的几率不等，且奖池中任一赏种数量不受限制。
    \n2、玩家在一个主题奖池内抽奖，无限赏奖项从高到低依次为魔王款、超神款、欧皇款、稀有款、普通款等（不同盲盒商品概率不同，具体概率以页面公示为准）。
    \n3、任意购买大魔王争霸模式的赏品组(即页面标有"魔王款"中的1张或多张明信片。如果该组商品有新魔王出现，魔王及"魔王"头衔将被新魔王接力取代，否则一直保留。
    \n4、魔王奖励获得方式:（1)用户在成为魔王期间，每有一位用户购买一张明信片(5张会有5次奖励、10张有10次奖励)且未获得魔王款赠品，魔王就能获得该笔订单的1%奖励。（2)当魔王及"魔王"头衔被新魔王取代时，原魔王不再获得魔王奖励，且結算在任时奖励。（3）每个用户每次成为魔王期间内获得返利无上限限制(如有更改，另行通知)，可在[查看明细]中查看魔王奖励情况。
    \n5、魔王up说明：每1W发没中魔王，就会出现一个UP，UP会增加魔王中奖概率。比如：魔王原本是0.01%的概率，现在有两个UP，概率增加了0.02%，魔王总体概率提升至0.03%，在下个魔王诞生前，UP越多,中魔王的几率越大（抽中魔王以后UP会重置，恢复到原本概率）    
    `},
    POINT: {title: '积分赏玩法说明', text: `本箱规则\n1、抽赏规则：仅限积分购买。`},
  }
  return rules;
}

module.exports = {
  urls,
  getRules
}

