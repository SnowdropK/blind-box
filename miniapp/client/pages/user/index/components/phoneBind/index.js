// components/guide/guide.js
const app = getApp();
// const API = require('../../common/api/user.js');
import { updateUserPhone } from '../../../../../common/api/user'

Component({
    /**
     * 组件的属性列表
     */
    props: {
        userInfo: {},
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
        close() {
            this.props.onClose()
        },
        refuse() {
            // this.triggerEvent('close');
            this.props.onClose()
            a.showModal({
                title: '提示',
                content: '请授权手机号，才能完整体验小程序功能！',
                showCancel: false,
                confirmText: '知道了'
            })              
        },
        /**
         * 绑定用户手机号码
         */
        updateUserPhone(e){
            if (this.props.userInfo.telephone) return;
            let data = e.detail;
            if (data.errMsg === "getPhoneNumber:ok") { // errMsg: "getPhoneNumber:fail user deny"
                data.sessionKey = app.globalData.sessionKey
                data.appid = wx.getAccountInfoSync().miniProgram.appId
                updateUserPhone(data).then(res => {
                    // this.getUserDetail();
                    this.props.getNewUserDetail()
                    a.hideLoading()
                })
            }
        },
    }
  })
  