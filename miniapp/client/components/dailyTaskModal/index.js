import { fetchTaskList, fetchInviteInfo, followTaoBaoStore, signToday, fetchTaskOperate } from '../../common/api/reward.js'
import { fetchNotice } from '../../common/api/notice'

const app = getApp();
const { cloud } = app

Component({
  /**
   * 组件的属性列表
   */
  props: {
    title: '',
    followPoint: 0,
    followStore: false,
    storeOwnerId: ''
  },

  /**
   * 组件的初始数据
   */
  data: {
    taskList: [],
    taskDayMap: {
      1: '1st',
      2: '2nd',
      3: '3rd',
      4: '4th',
      5: '5th',
      6: '6th',
      7: '7th',
    },
    todaySign: false,
    inviteLimit: null,
    inviteNum: 0,
    invitePoint: 0,
    TB_TASK_FOLLOW_OPEN: false, 
    TB_TASK_INVITE_OPEN: false, 
    TB_TASK_SIGN_OPEN: false,
    noticeTitle: '',
    noticeWord: '',
    DAILY_TASK_RULE: '',
    isRichText: false
  },
  didMount() {
    this.setData({
      hasFollowStore: this.props.followStore
    })
    this.getTaskOperate();
    this.getTaskList();
    this.getInviteInfo();
    // 任务规则
    this.getNotice();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 阻止遮罩层穿透事件
    preventTouchMove() {
      return true;
    },
    /**
     * 获取公告
     */
    getNotice() {
      fetchNotice(cloud, 'TB_TASK_SIGN_RULE').then(res => {
        this.setData({
          DAILY_TASK_RULE: res.keyValue
        })
      })
    },
    // 规则弹窗初始化
    defaultDialogRef(ref) {
      this.defaultDialogRef = ref
    },
    // 公共弹窗
    showDialog() {
      this.setData({
        noticeWord: this.data['DAILY_TASK_RULE']
      })
      this.defaultDialogRef.show()
    },
    // 关闭公共弹窗
    // closeRuleDialog() {
    //   this.setData({
    //     showDefaultDialog: false
    //   })
    // },
    async getTaskOperate() {
      const list = ['TB_TASK_FOLLOW_OPEN', 'TB_TASK_SIGN_OPEN', 'TB_TASK_INVITE_OPEN'];
      const { TB_TASK_FOLLOW_OPEN, TB_TASK_INVITE_OPEN, TB_TASK_SIGN_OPEN } = await fetchTaskOperate(cloud, { list });
      this.setData({
        TB_TASK_FOLLOW_OPEN: JSON.parse(TB_TASK_FOLLOW_OPEN), 
        TB_TASK_INVITE_OPEN: JSON.parse(TB_TASK_INVITE_OPEN), 
        TB_TASK_SIGN_OPEN: JSON.parse(TB_TASK_SIGN_OPEN)
      })
    },
    // 获取邀请信息
    async getInviteInfo() {
      const { inviteLimit, inviteNum, invitePoint } = await fetchInviteInfo(cloud);
      this.setData({
        inviteLimit,
        inviteNum,
        invitePoint
      })
    },
    // 获取任务列表
    async getTaskList() {
      const { signList, todaySign } = await fetchTaskList(cloud);
      const taskList = (signList || []).map((item, index) => {
        // const taskNo = item.todaySign ? 2 : (item.sign ? 1 : 3 );
        const taskNo = item.sign ? 1 : 3 ;
        return { id: index + 1, img: `/images/reward/task/taskCheck${taskNo}.png`, taskDay: this.data.taskDayMap[index+1], ...item };
      })
      this.setData({
        taskList,
        todaySign
      })
    },
    // 签到
    async signToday() {
      if (this.data.todaySign) return;
      await signToday(cloud); 
      this.getTaskList();
      my.showToast({
        content: '已签到',
        icon: 'none'
      })
    },
    // 关注淘宝店铺：接口
    async followTaoBaoStore() {
      await followTaoBaoStore(cloud);
      this.setData({
        hasFollowStore: true
      })
    },
    // 邀请新用户
    goToInvite() {
      my.showSharePanel();
    },
    // 关注淘宝店铺
    goToFollow() {
      if (this.data.hasFollowStore) return;
      // 关注
      my.tb.favorShop({
        id: this.props.storeOwnerId,
        success: (res) => {
          my.alert({ content: '关注淘宝店铺成功！' });
          this.followTaoBaoStore();
        },
        fail: (res) => {
          const { errorMessage = '' } = res || {};
          my.alert({ content: JSON.stringify(errorMessage) })
        }
      })
      // 取消关注
      // my.tb.unFavorShop ({
      //   id: this.props.storeOwnerId,
      //   success: (res) => {
      //     my.alert({ content: "取消关注淘宝店铺成功" });
      //   },
      //   fail: (res) => {
      //     my.alert({ content: "fail - " + res.error });
      //   }
      // });
    },
    close() {
      this.props.onClose('showDailyTaskDialog');
    },
    ensure() {
      this.props.onEnsure();
    }
  }
})
