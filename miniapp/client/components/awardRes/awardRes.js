Component({
  mixins: [],
  data: {
    show: false,
    try: false,
    check: true,
    goods: [
      // {
      //   word: 'UR',
      //   img: 'https://chujiangupload.xingyunyfs.com/user_1/1625782915185164288.jpg',
      //   name: '测试1',
      //   retrievePrice: '100',
      //   number: 2
      // },
    ],
  },
  props: {
    n_num: 1,
  },
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    //关闭
    close() {
      this.setData({
        show: false
      })
      this.props.onClose()
    },
    //显示
    show(list = [], num) {
      const { data } = my.getStorageSync({ key: 'SKIP_ANIMATION' })
      if (!data) {
        my.setStorage({
          data: {
            skip: true
          },
          key: 'SKIP_ANIMATION',
        });
      }
      if (list.length) {
        this.setData({
          check: data ? data.skip : true,
          show: true,
          goods: list,
          n_num: num === 'try' ? 1 : num,
          try: num === 'try'
        })
      }
    },
    // 再来n抽
    againTen() {
      // const data = app.globalData.payPrevInfo
      this.props.onPostCardPay(this.data.n_num)
      this.setData({
        show: false
      })
    },
    // 跳过动画
    skipAnimation() {
      this.setData({
        check: !this.data.check
      })
      my.setStorage({
        data: {
          skip: this.data.check
        },
        key: 'SKIP_ANIMATION',
        success: () => {
        },
        fail: error => {
          console.log(error)
        }
      });
    },
    //去赏袋
    toMyBag() {
      my.switchTab({
        url: '/pages/mybag/index'
      })
    },
  },
});