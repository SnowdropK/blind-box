// components/gotoAuth/gotoAuth.js
Component({
  /**
   * 组件的属性列表
   */
  props: {
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
    gotoLogin(){
      my.switchTab({
        url:"../../pages/user/index/user",
        fail(){
          my.switchTab({
            url:"../../../pages/user/index/user"
          })
        }
      })
    }
  }
})
