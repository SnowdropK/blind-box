## 微信小程序迁移淘宝小程序总结

### 文件后缀
1、xml后缀改为axml
2、wxss后缀改为acss

### 配置文件
```
"defaultTitle": "积分商城",
"navigationBarForceEnable": true
```

### 结构文件
```
<wxs src="/common/utils/filter.wxs" module="filter" />
改为
<import-sjs from="/common/utils/filter.sjs" name="filter" />

wx:if a:if
wx:else a:else
wx:for a:for
wx:key a:key
catchtap catchTap
bindtap onTap
a:key="this" a:key="*this"
bindscrolltolower onScrollToLower
bindscroll onScroll
bindrefresherrefresh  my.startPullDownRefresh ？？？
bindinput onInput
bindconfirm onConfirm
bindchange onChange onInput
catchtouchmove touchMove
```

```
<block a:for="{{awardList}}" a:key="*this"></block>
```


### JS文件
```
const app = getApp();
const { cloud, setUserInfo, getUserInfo } = app   
const userInfo = getUserInfo()
app.globalData.hasLogin  app.globalData.isLogin === 1 
app.globalData.userInfo
```
```
  properties: { },
  // 改为
  props: {},
```

```
my.hideTabBar({
  animation: true
})
my.showLoading({
  mask: true
})
```

```
setNavigationBarTitle 
setNavigationBar
onShareAppMessage
properties props
wx.navigateTo my.navigateTo
my.switchTab !!!
wx.showToast my.showToast
my.showToast({
  content: '查看模式下不能进行发货',
  icon: 'none'
})
e.currentTarget.dataset e.target.dataset
wx.chooseAddress my.tb.chooseAddress
```

```
事件绑定，遵循驼峰命名规范，例如onTap
this.triggerEvent('close') this.props.onClose();
 lifetimes: {
  ready() ->    didMount !!!!!
 }
```

```
//获取notice实例
saveGoodsViewRef(ref) {
  this.goodsViewRef = ref
},
<goods-view id="goodsView" ref="saveGoodsViewRef" />
```

### 判断条件
```
// 登录完成
app.globalData.isLogin === 1
```