Component({
  mixins: [],
  data: {
    show: false,
  },
  props: {
    title: '',
    info: '',
    ruleNumber: null,
    isRichText: false
  },
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    /**
     * 关闭弹窗
     */
    close() {
      this.setData({
        show: false
      })
    },
    /**
     * 显示弹窗
     */
    show() {
      this.setData({
        show: true
      })
    },
    /**
     * 阻止滑动
     */
    stopScroll() {
      return false;
    }
  },
});