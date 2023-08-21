Component({
  /**
   * 组件的属性列表
   */
  props: {
    title: '规则',
    btnTitle: '',
    content: '',
    isRichText: false,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goTapSome() {
      my.showToast({
        content: '关注',
        icon: 'none'
      })
    },
    
    show() {
      this.setData({
        showModal: true
      })
    },
    close() {
      // this.triggerEvent('close')
      // console.log(this.props);
      // this.props.closeDialog()
      this.setData({
        showModal: false
      })
    },
    stopScroll() {
      return false;
    },
  }
})
