// components/membershipCard/index.js

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
      this.triggerEvent('close')
    }
  },
  lifetimes: {
    ready() {
    }
  },
})