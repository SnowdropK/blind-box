Component({
  mixins: [],
  data: {
    newSignBtnState: false, // 按钮签到状态
    continuityDays7: false, // 连续7
    continuityDays3: false, // 连续3
    myToday: '',   // 周几
    newSignNum: 0,  // 签到天数
    newSignIntegral:0, // 签到积分
    // 签到数组
    isNewSignedArr: [
      {
      "day": "一",
      point: 1,
      "isSigned": true
      },
      {
      "day": "二",
      point: 1,
      "isSigned": false
      },
      {
      "day": "三",
      point: 1,
      "isSigned": false
      },
      {
      "day": "四",
      point: 5,
      "isSigned": false
      },
      {
      "day": "五",
      point: 1,
      "isSigned": false
      },
      {
      "day": "六",
      point: 1,
      "isSigned": false
      },
      {
      "day": "七",
      point: 10,
      "isSigned": false
      }
    ],
  },
  props: {},
  didMount() {
    var that = this
    //   myDate = new Date(),
    //   myToday = myDate.getDay(); // 周几 0 1 2 3 4 5 6
    // that.setData({
    //   myToday: myToday
    // })
    // 获取签到天数


    that.signAddFen();
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    //-------点击签到---------
    bindSignFn(e){
      var that = this,
        newSignNum = that.data.newSignNum,
        today = that.data.myToday;
      const arr = [],
        newSignArr = [...arr, ...that.data.isNewSignedArr];
      //
      // today = today - 1 > 0 ? today - 1 : 6;
      today = today - 1 > 0 ? today - 1 : 0;
      newSignArr[today].isSigned = true;
      
      // 当前积分
      newSignNum++;
      var curFen = that.data.newSignIntegral + 1;
      
      that.setData({
        newSignBtnState: true,
        newSignNum: newSignNum,
        newSignIntegral: curFen,
        isNewSignedArr: newSignArr,
      })
      
      that.signAddFen();
    },
      
      //签到积分函数
      //连续 天数-积分： 周三+3：周一，周二，周三（1+1+3=5）； 周六+7：周日到周六（1+1+3+1+1+1+7=15）
    signAddFen(e) {
      var that = this,
        oneIsSigned = that.data.isNewSignedArr[0].isSigned,
        twoIsSigned = that.data.isNewSignedArr[1].isSigned,
        threeIsSigned = that.data.isNewSignedArr[2].isSigned,
        fourIsSigned = that.data.isNewSignedArr[3].isSigned,
        fiveIsSigned = that.data.isNewSignedArr[4].isSigned,
        sixIsSigned = that.data.isNewSignedArr[5].isSigned,
        sevenIsSigned = that.data.isNewSignedArr[6].isSigned;
      
      // 另外加分-黄色小框显示 周三+3 , 周日+7
      if (oneIsSigned && twoIsSigned && that.data.myToday == 3) {
        that.setData({
          continuityDays3: true
        })
      } else if (oneIsSigned && twoIsSigned && threeIsSigned && fourIsSigned && fiveIsSigned && sixIsSigned && that.data.myToday == 0) {
        that.setData({
          continuityDays7: true
        })
      }
      
      // 签到后执行
      if (that.data.newSignBtnState) {
        // 周三 ： 一 二 三
        if (oneIsSigned && twoIsSigned && threeIsSigned) {
          var fens = that.data.newSignIntegral + 3 - 1;
          that.setData({
            newSignIntegral: fens
          })
        }
        // 所有签了： 一 二 三 四 五 六 日
        if (oneIsSigned && twoIsSigned && threeIsSigned && fourIsSigned && fiveIsSigned && sixIsSigned && sevenIsSigned) {
          var fens = that.data.newSignIntegral + 7 - 1;
          that.setData({
            newSignIntegral: fens
          })
        }
      }
    },
  },
});