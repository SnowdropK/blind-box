
import cloud from '@tbmp/mp-cloud-sdk';
// test | pre | online, 对应 测试 预发 线上
cloud.init({
  env: 'test'
});
import { userLogin } from './common/api/user'

let pid = null

App(
  {
    cloud,
    onLaunch(options) {
      // // 第一次打开
      this.getSystemInfo()
      this.setPayMent(null)
      const isShow = this.getGuide()
      if (isShow === null) {
        //设置第一次显示引导
        this.setGuide(true)
      }
    },
    onShow(options) {
      // 从后台被 scheme 重新打开
      const { path, query } = options || {}
      let uid = ''
      if (query && query['pid']) {
        uid = query['pid']
      }
      if (uid || path != 'pages/reward/index/index') {
        // 如果不是首页，或者uid有调用授权登录，如果是首页首页直接调用授权登录
        this.authUser(uid)
      }
    },
    // 全局页面分享
    onShareAppMessage () {
      const { openId = '' } = this.getUserInfo();
      return {
        title: '核玩扭蛋机', // 标题
        desc: '邀请好友赢积分~', // 描述
        path: `pages/reward/index/index?pid=${openId}`, // 分享的小程序页面
        imageUrl: 'https://chujiangupload.oss-cn-beijing.aliyuncs.com/tb-static/special-img/reward/share2.png',
        success(res){
          console.log('success', res);
        },
        fail(res){
          console.log('fail',res)
        },
      }
    },
    globalData: {
      systemInfo: null, // 系统信息
      isLogin: 0, // 是否登录
      userState: 0, // 是否冻结
    },
    //用户授权
    authUser(uid = '') {
      if (uid) {
        pid = uid
      }
      my.authorize({
        scopes: ['scope.userInfo', 'scope.clipboard', 'scope.addressList'], //  'scope.album'
        success: (res) => {
          const { accessToken: { accessToken: token = null } = {} } = res || {}
          if (token) {
            this.authUserInfo(token)
          } else {
            if (res.accessToken) {
              this.authUserInfo(res.accessToken)
            } else {
              this.authUserInfo('')
            }
          }
        },
        fail: (error) => {
          console.log(error)
          this.authUserInfo('')
        }
      });
    },
    
    //授权获取用户信息
    authUserInfo(token = '') {
      my.showLoading({
        mask: true,
      })
      my.getAuthUserInfo({
        success: (userInfo) => {
          let userData = { ...userInfo, token }
          if (pid) {
            userData['pid'] = pid
          }
          userLogin(this.cloud, userData).then(res => {
            my.hideLoading()
            if (res.userState == 1) {
              this.globalData.userState = 1
              my.showToast({
                content: '您的账户已经被冻结，无法使用小程序的功能',
                duration: 3000
              });
              return
            }
            this.setUserInfo({ ...res, ...userData })
            this.globalData.isLogin = 1
          }).catch(error => {
            console.log('userLogin-error', error)
            my.hideLoading()
            this.globalData.isLogin = 2
          })
        },
        fail: (error) => {
          console.log('authUserInfo-error', error)
          this.globalData.isLogin = 2
        }
      });
    },
    //获取系统信息
    getSystemInfo() {
      const systemInfo = my.getSystemInfoSync()
      this.globalData.systemInfo = systemInfo
    },
    //设置用户信息
    setUserInfo(data) {
      my.setStorage({
        data,
        key: 'USER_INFO',
        success: () => {
        },
        fail: error => {
          console.log(error)
        }
      });
    },
    //获取用户信息
    getUserInfo() {
      const { data = {} } = my.getStorageSync({ key: 'USER_INFO' })
      return data
    },
    //设置选中的IP数据
    setChoseIp({ id = 0, no = 0 }) {
      my.setStorage({
        data: { id, no },
        key: 'CHOSE_IP',
        success: () => {
        },
        fail: error => {
          console.log(error)
        }
      });
    },
    //获取选中的IP数据
    getChoseIp() {
      const { data = { id: 0, no: 0 } } = my.getStorageSync({ key: 'CHOSE_IP' })
      return data
    },
    //设置选中支付账号
    setPayMent(data) {
      my.setStorage({
        data,
        key: 'PAY_MENT',
        success: () => {
        },
        fail: error => {
          console.log(error)
        }
      });
    },
    //获取选中支付账号
    getPayMent() {
      const { data } = my.getStorageSync({ key: 'PAY_MENT' })
      return data
    },
    //设置是否显示引导
    setGuide(isShow = false) {
      my.setStorage({
        data: { isShow },
        key: 'SHOW_GUIDE',
        success: () => {
        },
        fail: error => {
          console.log(error)
        }
      });
    },
    //获取是否显示引导
    getGuide() {
      const keyData = my.getStorageSync({ key: 'SHOW_GUIDE' })
      if (keyData && keyData.data) {
        const { isShow = null } = keyData.data
        return isShow
      } else {
        return null
      }
    },
    //设置是否同意协议
    setAgreement(data) {
      my.setStorage({
        data: data,
        key: 'AGREEMENT',
        success: () => {
        },
        fail: error => {
          console.log(error)
        }
      });
    },
    //获取是否同意协议
    getAgreement() {
      const keyData = my.getStorageSync({ key: 'AGREEMENT' })
      if (keyData && keyData.data) {
        const { check1 = false, check2 = false, check3 = false } = keyData.data || {}
        return {
          check1,
          check2,
          check3
        }
      } else {
        return {
          check1: false,
          check2: false,
          check3: false
        }
      }
    },
    //监听全局变量
    // watch(serf, method, isstr) {
    //   let obj = this.globalData || null
    //   if (!obj) return
    //   Object.defineProperty(obj, isstr, {
    //     configurable: true,
    //     enumerable: true,
    //     set: value => {
    //       method(serf, value);
    //     },
    //     get: value => {
    //       return value
    //     }
    //   })
    // }

    /**
     * 监听是否登录完毕
     * @param {*} fn 
     */
    watch: function (fn) {
      const obj = this.globalData
      Object.defineProperty(obj, 'isLogin', {
        configurable: true,
        enumerable: true,
        set: function (value) {
          this._isLogin = value;
          fn(value);
        },
        get: function () {
          return this._isLogin
        }
      })
    },
  });
