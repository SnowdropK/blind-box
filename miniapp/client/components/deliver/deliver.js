// const API = require('../../common/api/myBag');
import imath from '../../common/js/base/math';

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
    goods: [],
    postage: 0,
    preSale: false,
    inclusionThreshold: 50
  },

  /**
   * 组件的初始数据
   */
  data: {
    // show: false,
    showAni: 'uping',
    message: null,
    address: null,
    choseAddress: false,
    // goods: [],
    // postage: 0,
    totalMoney: 0,
    totalNum: 0,
    // preSale: false,
    checkAddress: null,
    type: 'deliver', //deliver 发货   recovery 回收
    physicalTotalMoney: 0,
    physicalTotalNum: 0,
  },
  didMount() {
    let totalMoney = 0
    let totalNum = 0
    let physicalTotalMoney = 0;
    let physicalTotalNum = 0;
    let list = this.props.goods || [];
    for (let i = 0; i < list.length; i++) {
      const ele = list[i];
      totalMoney = imath.accAdd(totalMoney, imath.accMul(ele.retrievePrice, ele.choseNumber));
      totalNum = imath.accAdd(totalNum, ele.choseNumber)
      if (ele.goodsType === 0) {
        physicalTotalNum ++;
        physicalTotalMoney = imath.accAdd(physicalTotalMoney, imath.accMul(ele.retrievePrice, ele.choseNumber));
      }
    }
    // totalMoney = iMath.accAdd(totalMoney, iMath.accMul(item.retrievePrice, item.choseNumber));
    // totalNum = iMath.accAdd(totalNum, item.choseNumber)
    this.setData({
      type: this.props.preSale ? 'recovery' : 'deliver',
      totalMoney,
      totalNum,
      physicalTotalMoney,
      physicalTotalNum,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 修改类型
     */
    changeType () {
      if (this.props.preSale) {
        return
      }
      this.setData({
        type: this.data.type === 'deliver' ? 'recovery' : 'deliver'
      })
    },

    /**
     * 确认发货
     */
    confirmDeliver () {
      let that = this
      if (this.data.type === 'recovery') {
        if (!this.data.checkAddress) {
          my.showToast({
            content: '请选择收货地址',
            icon: 'none'
          })
          return
        }
        my.confirm({
          title: "请注意",
          content: '您的商品将由商家进行云仓发货',
          success (res) {
            that.props.sendRecovery(that.data.checkAddress)
          }
        })
        return
      }

      if (!this.data.choseAddress) {
        my.showToast({
          content: '请选择收货地址',
          icon: 'none'
        })
      } else {
        let data = {
          message: this.data.message,
          address: this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo,
          consignee: this.data.address.name,
          mobile: this.data.address.telNumber,
          totalMoney: this.data.totalMoney,
        }
        this.props.onSendDeliver(data)
      }
    },
    /**
     * 获取用户收获地址
     */
    getUserAdd () {
      // if (this.data.type === 'recovery') {
      //   this.triggerEvent('showAddress')
      //   return
      // }

      let that = this
      app.globalData.getMyBag = false
      my.tb.chooseAddress({
        }, (res) => {
          if (res && res.errorMessage) {
            my.showToast({
              type: 'fail',
              content: `${res.errorMessage}请在右上角授权管理中允许访问淘宝地址列表。`,
              duration: 3000
            });
            return;
          }
          that.setData({
            address: res,
            choseAddress: true
          })
        }, (res) => {
          my.showToast({
            type: 'fail',
            content: '失败了',
            duration: 3000
          });
      })
    },
    /**
     * 修改输入
     */
    changeInput (e) {
      this.data.message = e.detail.value;
    },
    /**
     * 关闭弹窗
     */
    close () {
      this.setData({
        showAni: "downing"
      })

      setTimeout(() => {
        this.setData({
          show: false
        })
        this.props.onClose();
      }, 200)
    },
    /**
     * 显示弹窗
     */
    // show (list, postage, preSale) {
    //   let total = 0
    //   let totalNum = 0
    //   for (let i = 0; i < list.length; i++) {
    //     const ele = list[i];
    //     total += ele.retrievePrice * ele.choseNumber
    //     totalNum += ele.choseNumber
    //   }

    //   this.setData({
    //     show: true,
    //     showAni: "showing",
    //     goods: list,
    //     message: null,
    //     address: null,
    //     choseAddress: false,
    //     postage: postage,
    //     preSale: preSale === 'PRE_SALE',
    //     type: preSale === 'PRE_SALE' ? 'recovery' : 'deliver',
    //     totalMoney: total,
    //     totalNum: totalNum
    //   })

    //   this.getAddressList()
    // },
    /**
     * 获取地址
     */
    // getAddressList(){
    //   getAddressList(cloud, {
    //     pageNo: 1,
    //     pageSize: 999
    //   }).then(res => {
    //     if (res.code === 'SUCCESS') {
    //       let list = res.data.records
    //       let index = imath.randomRange(0, list.length - 1)
    //       let add = list[index]
    //       this.setData({
    //         checkAddress: add
    //       })
    //     }
    //   })
    // },
    /**
     * 阻止滑动
     */
    stopScroll () {
      return false;
    }
  }
})