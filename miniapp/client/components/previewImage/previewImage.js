Component({
  mixins: [],
  data: {
    show: false,
    imageUrl: ''
  },
  props: {},
  didMount() { },
  didUpdate() { },
  didUnmount() { },
  methods: {
    close() {
      this.setData({
        show: false
      })
    },
    show(imageUrl) {
      if (imageUrl) {
        this.setData({
          show: true,
          imageUrl
        })
      }
    },
  },
});