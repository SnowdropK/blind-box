// components/address/address.js
import { fetchAddressList as getAddressList } from '../../common/api/myBag.js';

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
    checkIndex: null,
    list: [],
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 阻止滑动
     */
    stopScroll () {
      return false;
    },
    /**
     * 显示
     */
    show () {
      this.setData({
        isShow: true
      })
      this.requestData()
    },
    /**
     * 关闭
     */
    close () {
      this.setData({
        isShow: false
      })
    },
    /**
     * 确定
     */
    onConfirm () {
      if (!this.data.checkIndex) {
        my.showToast({
          content: '请选择地址',
          icon: 'none'
        })
        return
      }
      this.close()
      // this.triggerEvent('checkAddress', this.data.list[this.data.checkIndex - 1])
      this.props.checkAddress(this.data.list[this.data.checkIndex - 1])
    },
    /**
     * 单选监听
     * @param {*} e 
     */
    radioChange (e) {
      this.setData({
        checkIndex: e.detail.value || null
      })
    },
    /**
     * 获取地址列表
     */
    requestData () {
      getAddressList(cloud,{
        pageNo: 1,
        pageSize: 999
      }).then(res => {
        this.setData({
          list: res.records
        })
      })
    }
  }
})
