Component({
  mixins: [],
  data: {
    list: [
      {
        "pagePath": "/pages/reward/index/index",
        "text": "抽赏",
        "iconPath": "/images/icon/tab/reward.png",
        "selectedIconPath": "/images/icon/tab/reward_a.png"
      },
      {
        "pagePath": "/pages/mybag/index",
        "text": "赏袋",
        "iconPath": "/images/icon/tab/bag.png",
        "selectedIconPath": "/images/icon/tab/bag_a.png"
      },
      {
        "pagePath": "/pages/user/index/index",
        "text": "我的",
        "iconPath": "/images/icon/tab/user.png",
        "selectedIconPath": "/images/icon/tab/user_a.png"
      }
    ]
  },
  props: {
    selected: 0
  },
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    switchTab(e) {
      const data = e.target.dataset
      const url = data.path
      my.switchTab({
        url:url
      })
    }
  },
});