import { fetchAddressList as getAddressList } from '../../common/api/myBag'
const imath = require('../../common/js/base/math')

const app = getApp();
const { cloud } = app

Component({
  /**
   * 组件的属性列表
   */
  props: {
    // checkAddress: {
    //   type: Object,
    //   value: null
    // }
    choseList: [],
    totalMoney: 0,
    totalNum: 0
  },

  /**
   * 组件的初始数据
   */
  data: {
    // show: false,
    showAni: 'showing1',
    moveAni: 'uping',
    address: null,
    choseAddress: false,
    goods: [],
    // totalMoney: 0,
    // totalNum: 0,
    checkAddress: null,
    type: 'recovery' //deliver 发货   recovery 回收
  },

  didMount() {
    this.setData({
      goods: this.props.choseList || [],
    }, () => {
      this.getAddressList()
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 显示弹窗
     */
    // show (choseList, totalMoney, totalNum) {
    //   this.setData({
    //     show: true,
    //     showAni: "showing1",
    //     moveAni: "uping",
    //     goods: choseList || [],
    //     address: null,
    //     choseAddress: false,
    //     type: 'recovery',
    //     totalMoney,
    //     totalNum
    //   })
    //   this.getAddressList()
    // },
    /**
     * 确认发货
     */
    confirmDeliver () {
      let that = this
      if (this.data.type === 'recovery') {
        my.confirm({
          title: "请注意",
          content: '您的商品将转化为魔晶',
          success (res) {
            if (res.confirm) {
              // that.triggerEvent('sendRecovery', that.data.checkAddress)
              this.props.sendRecovery(that.data.checkAddress)
            }
          }
        })
        return
      }
    },
    /**
     * 关闭弹窗
     */
    close () {
      this.setData({
        showAni: "hideing1",
        moveAni: "downing"
      })

      setTimeout(() => {
        this.props.onClose();
      }, 200)
    },
    /**
     * 获取地址
     */
    async getAddressList() {
      const data = await getAddressList(cloud, { pageNo: 1, pageSize: 999 });
      const { records = [] } = data || {}
      const index = imath.randomRange(0, records.length - 1)
      const checkAddress = records[index]
      this.setData({
        checkAddress
      })
    },
    /**
     * 阻止滑动
     */
    stopScroll () {
      return false;
    }
  }
})