import { NOTICE_TITLE_MAP, NOTICE_TYPE_MAP, READ_FIELD } from '../../../../../consts/index'
// service
import { markNoticeRead } from '../../../../../common/api/user'

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
    READ_FIELD,
    NOTICE_TITLE_MAP,
    NOTICE_TYPE_MAP
  },

  /**
   * 组件的方法列
   */
  methods: {
    /**
     * 标记消息已读
     * @param {*} msgId 
     * @param {*} type 
     */
    async markNoticeRead(msgId, type) {
      await markNoticeRead(cloud, { msgId, type })
    },
    goToTarget() {
      const info = this.props.info;
      const { id, type, readField, content = '', createTime = '', updateTime = '', activityWelfare = {}, extraJson = {} } = info || {}
      // 活动
      if (type === NOTICE_TYPE_MAP.ACTIVITY) {
        // 标记已读
        if (readField === READ_FIELD.UN_READED) this.markNoticeRead(id, type);
        my.navigateTo({
          url: `/pages/reward/activityList/activityDetail/index?id=${activityWelfare.id || ''}`,
        })
      }
      // 系统
      if (type === NOTICE_TYPE_MAP.SYSTEM) {
        console.log('系统', content)
        my.setStorageSync({
          key: 'systemNoticeRichText',
          data: {
            createTime,
            updateTime,
            content
          }
        });
        // 标记已读
        if (readField === READ_FIELD.UN_READED) this.markNoticeRead(id, type);
        my.navigateTo({
          url: `/pages/user/message/systemNotice/index`,
        })
      }
      // 抽赏
      if (type === NOTICE_TYPE_MAP.REWARD) {
        const info = JSON.parse(extraJson);
        const { currentBox, goodsId, rewardType, hit } = info || {};
        // 标记已读
        if (readField === READ_FIELD.UN_READED) this.markNoticeRead(id, type);
        // 中奖
        if (hit) {
          my.reLaunch({
            url: `/pages/mybag/index?goodsId=${goodsId}&win=${true}`,
          })
        } else {
          my.navigateTo({
            url: `/pages/reward/infInfo/infInfo?id=${goodsId}&no=${currentBox}`,
          })
        }
      }
    }
  }
})