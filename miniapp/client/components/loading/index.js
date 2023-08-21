Component({
  /**
   * 组件的属性列表
   */
  props: {
    show: {
      type: Boolean,
      value: false,
      observer(val) {
        this.setData({ visible: val });
      }
    },
    showIcon: true,
    desc: ''
  },

  /**
   * 组件的初始数据
   */
  data: {
    visible: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})