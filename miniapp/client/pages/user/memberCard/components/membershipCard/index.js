// components/membershipCard/index.js
// const API = require('../../../../../common/api/user.js');
import { receiveCardPrize } from '../../../../../common/api/user.js';

const app = getApp();
const { cloud } = app;

Component({
  /**
   * 组件的属性列表
   */
  props: {
    info: {}
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusList: [
      { value: -1, text: '不可购买' },
      { value: 0, text: '可购买' },
      { value: 1, text: '可领取奖励' },
      { value: 2, text: '今日已领取' },
    ],
    STATUS_MAP: {
      '-1': '不可购买',
      0: '可购买',
      1: '可领取奖励',
      2: '今日已领取',
    },
    COLOR_MAP: {
      // 体验卡
      1: {
        themeColor: '#472A0D',
        subthemeColor: '#B27B60'
      },
      // 骑士卡
      2: {
        themeColor: '#472A0D',
        subthemeColor: '#B27B60'
      },
      // 男爵卡
      3: {
        themeColor: '#435370',
        subthemeColor: '#435370'
      },
      // 子爵卡
      4: {
        themeColor: '#435370',
        subthemeColor: '#435370'
      },
      // 伯爵卡
      5: {
        themeColor: '#46719B',
        subthemeColor: '#46719B'
      },
      // 侯爵卡
      6: {
        themeColor: '#46719B',
        subthemeColor: '#46719B'
      },
      // 公爵卡
      7: {
        themeColor: '#775605',
        subthemeColor: '#775605'
      },
      // 亲王卡
      8: {
        themeColor: '#775605',
        subthemeColor: '#775605'
      },
      // 君王卡
      9: {
        themeColor: '#775605',
        subthemeColor: '#FFFFFF'
      },
      // 帝王卡
      10: {
        themeColor: '#775605',
        subthemeColor: '#FFFFFF'
      },
    }
  },

  /**
   * 组件的方法列
   */
  methods: {
    /**
     * 领取奖励
     */
    async receiveRewards() {
      await receiveCardPrize(cloud, {});
      my.showToast({
        content: '每日奖励领取成功！',
        icon: 'none'
      })
      this.triggerEvent('receive')
    },
    // goToBuy() {
    //   const { status } = this.data.info
    //   if (status === -1) {
    //     wx.showToast({
    //       title: '未达到等级，不能购买',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    //   if (status === 1 || status === 2) {
    //     wx.showToast({
    //       title: '已购买该会员卡',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    // }
  },
  lifetimes: {
    ready() {
    }
  },
})