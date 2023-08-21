// pages/pickNum/inedx.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  props: {
    show: false,
    ani: '',
    info: {},
    pickNum: 0,
    pickNumMax: 0,
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
    cancel() {
      this.props.onHide();
    },
    ensure() {
      this.props.onChange();
    },
    // reducePickNum() {
    //   this.triggerEvent('reduce');
    // },
    pickNumChange(data) {
      this.props.onPick(+data.value);
    },
    getMin() {
      // this.setData({
      //   pickNum: 0
      // })
      this.props.onPick(0);
    },
    getMax() {
      // this.setData({
      //   pickNum: this.props.pickNumMax
      // })
      this.props.onPick(this.props.pickNumMax);
    },
    // addPickNum() {
    //   this.triggerEvent('add');
    // },
    /**
     * 关闭弹窗
     */
    close(){
      this.setData({
        show: false
      })
    },
    /**
     * 显示弹窗
     */
    show(type){
      this.setData({
        show: true,
        couponType: type
      })
    },
    /**
     * 阻止滑动
     */
    stopScroll(){
      return false;
    }
  }
})