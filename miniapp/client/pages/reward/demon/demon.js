import { getDemonList } from "../../../common/api/reward";
import icom from '../../../common/js/base/com.js'
const app = getApp();
const { cloud, getUserInfo } = app

Page({
  data: {
    devilInfo: {
      nickname: '',
      avatarUrl: '/images/reward/inf/who.png',
      time: '快来抢魔王宝座',
      ups: [],
      upsNum: 0,
      downOrderId: null
    },
    top: {},
    bottom: {},
    demonList: [],
    goodsId: '',
    currentBox: null,
  },
  queryData() {
    const userInfo = getUserInfo()
    let info = { ...this.data.devilInfo }
    try {
      getDemonList(cloud, { goodsId: this.data.goodsId, currentBox: this.data.currentBox }).then((res)=>{
        const { button: bottom, list: demonList, top = {} } = res;
        const { downOrderId, createTime } = top || {}
        if (Object.keys(top || {}).length !== 0 && downOrderId === null) {
          info = { ...this.data.devilInfo, ...top }
          info.time = `已占领 ${icom.timeFormatter(createTime.replace(/-/g,'/'))}`
        }
        console.log('info', info)
        this.setData({
          top,
          bottom: bottom || { nickname: userInfo.nickname, avatarUrl: userInfo.avatarUrl || '/images/icon/common/head.png', avatarBorderUrl: userInfo.avatarBorderUrl || '' },
          demonList,
          devilInfo: info
        })
      })
    } catch (error) {
      my.showToast({
        title: '出错了！',
        icon: 'error',
        duration: 2000
      })
    }
  },
  onLoad(query) {
    const { currentBox, goodsId } = query
    this.setData({
      goodsId,
      currentBox,
    })
    this.queryData()
  },
  onShow() {}
})