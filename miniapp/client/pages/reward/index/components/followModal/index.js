Component({
  /**
   * 组件的属性列表
   */
  props: {
    title: '',
    content: '',
    btnText: '确定'
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
     * 阻止遮罩层穿透事件
     */
    preventTouchMove() {
      return true;
    },
    close() {
      this.props.onClose('showFollowDialog');
    },
    ensure() {
      this.props.onEnsure();
    }
  }
})
