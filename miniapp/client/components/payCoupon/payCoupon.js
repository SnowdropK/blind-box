// components/payCoupon/payCoupon.js

Component({
  /**
   * 组件的属性列表
   */
  props: {
    info:  {},
    disable: false,
    check: true,
    status: 20,
    checkedCouponId: null,
    zoom: 1
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  didMount() {},
  /**
   * 组件的方法列
   */
  methods: {
    hadleSelect(e) {
      if (this.props.disable || !this.props.check ) return;
      const { info } = e.currentTarget.dataset
      // this.triggerEvent('changeChecked', info)
      this.props.changeChecked(info);
    }
  }
})