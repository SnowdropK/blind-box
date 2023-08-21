// components/membershipCard/index.js
const API = require('../../../../../common/api/user.js');

Component({
  /**
   * 组件的属性列表
   */
  props: {
    title: '',
    rule: ''
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列
   */
  methods: {
    closeRuleDialog() {
      this.props.onClose()
      // this.triggerEvent('close')
    }
  },
  lifetimes: {
    ready() {
    }
  },
})