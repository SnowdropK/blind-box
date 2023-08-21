Component({
  mixins: [],
  data: {
    show: false,
    goods: []
  },
  props: {},
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    hide() {
      this.setData({
        show: false
      })
    },
    show(list) {
      this.setData({
        show: true,
        goods: list
      })
    },
  },
});