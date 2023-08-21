// components/pay/pay.js
import { getRecoveryPrice } from '../../common/api/myBag.js'

const app = getApp();
const { cloud } = app

Component({
  /**
   * 组件的属性列表
   */
  props: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    showAni: '',
    moveAni: '',
    money: 0,
    priceTotal: 0,
    goods: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 上架赏品
     */
    shelfAard() {
      if (!this.props.money || this.props.money < 0) {
        my.showToast({
          content: '请输入大于0的正整数',
          icon: 'none'
        })
      }
      else {
        // console.log(this.data.money, this.data.priceTotal)
        if (this.props.money < this.data.priceTotal) {
          my.confirm({
            title: '云仓发货参考价格：' + this.data.priceTotal,
            content: '你的上架价格低于云仓发货价格，确定要上架吗？',
            success: (result) => {
              if (result.confirm) {
                this.close()
                // this.triggerEvent('sendShelf', this.data.money)
                this.props.sendShelf(this.props.money)
              }
            }
          });
        }
        else {
          this.close()
          // this.triggerEvent('sendShelf', this.data.money)
          this.props.sendShelf(this.props.money)
        }
      }
    },
    /**
     * 修改输入
     */
    changeInput(e) {
      // 修改
      this.data.money = Number(e.detail.value);
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.setData({
        showAni: "hideing1",
        moveAni: "downing"
      })

      setTimeout(() => {
        this.setData({
          show: false
        })
      }, 200)
    },
    /**
     * 显示弹窗
     */
    show(list) {
      this.setData({
        show: true,
        showAni: "showing1",
        moveAni: "uping",
        goods: list,
        money: null,
        priceTotal: 0
      })
      // console.log(list)
      this.getRecoveryPrice(list)
    },
    /**
     * 获取云仓发货价格
     */
    getRecoveryPrice(list) {
      let item = this.getChoseAwardList(list)
      let data = {
        retrieveList: item
      }
      getRecoveryPrice(cloud,data).then(res => {
        this.setData({
          priceTotal: res || 0
        })
      })
    },
    /**
     * 获取选择的赏品列表
     */
     getChoseAwardList(list) {
      let arr = []
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        let inArr = this.jadgeInArr(arr, element)
        if (inArr === 'none') {
          arr.push({
            "goodsId": element.goodsId,
            "number": 1,
            "rewardBagId": element.id,
            "rewardType": element.type.split('赏')[0]
          })
        } else arr[inArr].number += 1
      }
      return arr
    },
    /**
     * 判断是否在数组里面
     */
     jadgeInArr(arr, item) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.goodsId === item.goodsId && element.rewardBagId === item.id && item.type.indexOf(element.rewardType) !== -1) {
          return i
        }
      }
      return 'none'
    },
    /**
     * 阻止滑动
     */
    stopScroll() {
      return false;
    }
  }
})
