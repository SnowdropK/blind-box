// components/exchangeDialog/index.js
import { pointExchange } from '../../../../../common/api/user'

const app = getApp();
const { cloud } = app

Component({
  /**
   * 组件的属性列表
   */
  props: {
    info: {}
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 关闭弹窗
     */
    cancel(){
      // this.triggerEvent('close')
      this.props.onClose();
    },
    async pointExchange() {
      const { id } = this.props.info
      // num: nextNum 
      // const num = nextNum > 10 ? 10 : nextNum;
      // try {
      //   const { data, message, code } = await API.pointExchange({ id, num: 1 })
      //   if (code !== 'SUCCESS') {
      //     my.showToast({
      //       content: message,
      //       icon: 'none'
      //     })
      //     return;
      //   }
      //   my.confirm({
      //     title: '提示',
      //     content: '兑换成功！',
      //     confirmText: '知道了',
      //     showCancel: false
      //   })
      //   this.triggerEvent('ensure')
      // } catch {
      //   my.showToast({
      //     content: '出错了！',
      //     icon: 'none'
      //   })
      // }
      await pointExchange(cloud, { id, num: 1 })
      my.alert({
        title: '提示',
        content: '兑换成功！',
        buttonText: '知道了',
      })
      this.props.onEnsure();
    },
    ensure(){
      this.pointExchange()
    },
  }
})
