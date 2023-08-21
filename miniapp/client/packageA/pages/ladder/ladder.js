// const API = require('../../../common/api/reward.js');
// const API_N = require('../../../common/api/notice.js');
// const imath = require('../../../common/js/base/math.js');
import { getCurSeasonActivity, receiveLadderPrize } from '../../../common/api/reward.js'
import { fetchNotice } from '../../../common/api/notice'
import imath from '../../../common/js/base/math.js'

const app = getApp();
const { cloud } = app

const BUTTON_STATUS = {
    NOT_SATISFIED: 0,
    AVAILABLE_RECEIVE: 1,
    RECEIVED: 2
}

Page({
    /**
     * 初始数据
     */
    data: {
        currentAmount: 0,
        startTime: '', 
        endTime: '',
        isOnline: true,
        prizeList: [],
        receivedPizes: [],
        BUTTON_STATUS,
        showRuleDialog: false,
        showReceiveDialog: false,
        queryForm: {
            pageNo: 1, 
            pageSize: 10 
        },
        ruleTitle: '',
        ruleText: '',
        loading: false,
        showLadder: true,
        scrollHeight: 0,
        noticeTitle: '',
        noticeWord: '',
        isRichText: true
    },
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 查询公告
     */
    async getNotice() {
        const data = await fetchNotice(cloud,'RANGE_ACTIVE_RULE');
        const { keyName, keyValue } = data
        this.setData({
            ruleTitle: keyName,
            ruleText: keyValue,
        })
    },
    // 规则弹窗初始化
    defaultDialogRef(ref) {
        this.defaultDialogRef = ref
    },
    /**
     * 打开规则弹窗
     */
    openRuleDialog() {
        console.log('this.data.ruleText', this.data.ruleText)
        this.setData({
            noticeTitle: this.data.ruleTitle,
            noticeWord: this.data.ruleText
        }, () => {
            this.defaultDialogRef.show();
        })
    },
    /**
     * 查询当前赛季活动
     */
    async getCurSeasonActivity() {
        this.setData({
            loading: true
        })
        const data = await getCurSeasonActivity(cloud, this.data.queryForm);
        if (!data) {
            this.setData({
                showLadder: false,
                loading: false
            })
            return;
        }
        const { currentAmount, startTime, endTime, list = [] } = data || {};
        const currentPrizeList = list.map(item => {
            const { id, status, rewardAmount, rewardCoin, rewardGoodsId, rewardGoodsNum, rewardName, rewardImage } = item;
            let pizes = [];
            pizes.push({
              id: 1, name: `${rewardCoin}金币`, img: '/images/icon/reward/coin.png', num: 1
            });
            if (rewardGoodsId) {
              pizes.push({
                id: rewardGoodsId, name: `${rewardName} X${rewardGoodsNum}`, img: rewardImage, num: rewardGoodsNum
              });
            }
            return { 
                id, 
                status,
                title: status === BUTTON_STATUS.NOT_SATISFIED ?  `累计消费满${rewardAmount}送` : `您已经累计消费满${rewardAmount}送`,
                consumptionPrice: status === BUTTON_STATUS.NOT_SATISFIED ? imath.accSub(rewardAmount, currentAmount) : 0,
                pizes,
            }
        })
        const prizeList = [ 
            ...currentPrizeList, 
            // { 
            //     id: 1, 
            //     title: '累积消费满一百送', 
            //     status: 0, 
            //     name: '芝加哥', 
            //     consumptionPrice: 10,
            //     pizes: [ { id: 1, name: '金币', img: '', num: 4 }, { d: 2, name: '一番赏毛巾（随机款）', img: '', num: 4  } ] 
            // },
            // { 
            //     id: 1, 
            //     title: '累积消费满一百送', 
            //     status: 1, 
            //     name: '芝加哥', 
            //     consumptionPrice: 10,
            //     pizes: [ { id: 1, name: '金币', img: '', num: 4 }, { d: 2, name: '一番赏毛巾（随机款）', img: '', num: 4  } ] 
            // } ,
            // { 
            //     id: 1, 
            //     title: '累积消费满一百送', 
            //     status: 2, 
            //     name: '芝加哥', 
            //     consumptionPrice: 10,
            //     pizes: [ { id: 1, name: '金币', img: '', num: 4 }, { d: 2, name: '一番赏毛巾（随机款）', img: '', num: 4  } ] 
            // } 
        ]
        this.setData({
            currentAmount,
            startTime,
            endTime,
            prizeList,
            loading: false
        })
    },
    /**
     * 滚动区高度
     */
    getScrollHeight() {
        const that = this;
        my.getSystemInfo({
            success: function(res) {
                const windowHeight = res.windowHeight;
                const rect = my.createSelectorQuery().select('.scrollBox').boundingClientRect();
                rect.exec(ret => {
                    const top = (ret[0] || {}).top;
                    const height = windowHeight - top;
                    that.setData({
                        scrollHeight: height
                    });
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getScrollHeight();
        this.getNotice();
        this.getCurSeasonActivity();
    },
    /**
     * 加载下一页数据
     */
    // loadMore() {
    //     const pageNo = this.data.pageNo + 1;
    //     this.setData({
    //         queryForm: {
    //             pageNo,
    //             pageSize: 10,
    //         }
    //     }, () => {
    //         this.getCurSeasonActivity();
    //     })
    // },
    /**
     * 接口：领取奖品
     */
    async receivePrize(item) {
        await receiveLadderPrize(cloud, { id: item.id });
        this.setData({
            showReceiveDialog: true,
            receivedPizes: item.pizes,
        }, () => {
            this.getCurSeasonActivity();
        })
    },
    /**
     * 领取奖品
     */
    handleReceive(e) {
        const { item } = e.currentTarget.dataset
        this.receivePrize(item)
    },
    /**
     * 打开领取奖品弹窗
     */
    openReceiveDialog() {
        this.setData({
            showReceiveDialog: true
        })
    },
    /**
     * 关闭领取奖品弹窗
     */
    closeReceiveDialog() {
        this.setData({
            showReceiveDialog: false
        })
    }
})