Component({
  options: {
    multipleSlots: true
  },
  props: {
    // value: {
    //   type: Number,
    //   optionalTypes: [String],
    //   value: 1,
    //   observer(val) {
    //     if (val != this.data.inputValue) {
    //       this.setData({
    //         inputValue: this.getValue(val)
    //       })
    //     }
    //   }
    // },
    value: 1,
     //number、text（主要用与输入负号）
    type: 'number',
    //最小值
    min: 1,
    //最大值
    max: 99,
    //每次点击改变的间隔大小
    step: 1,
    //是否禁用操作
    disabled: false,
    //加减号宽度，单位rpx
    signWidth: 24,
    //加减号颜色
    signColor: '#181818',
    //input高度，单位rpx
    height: 40,
    //input宽度，单位rpx
    width: 80,
    //input圆角，单位rpx
    radius: 8,
    size: 26,
    //input 背景颜色
    backgroundColor: '#EEEEEE',
    //input 字体颜色
    color: '#181818',
    //输入框margin-left，margin-right值
    margin: 16,
    //是否自定义加减号，为true则去除默认加减号，使用插槽自定义
    custom: false,
    //索引值，列表中使用
    index: 0,
    //自定义参数
    params: 0
  },
  // observers: {
  //   'inputValue':function(newVal,oldVal){
  //     if(!isNaN(Number(newVal)) && Number(newVal) !== Number(oldVal)){
  //       const val = this.getValue(+newVal)
  //       this.triggerEvent("change", {
  //         value: val, 
  //         index: this.data.index,
  //         params: this.data.params
  //       });
  //       this.setData({
  //         value: val,
  //         oldValue:val
  //       })
  //     }
  //   }
  // },
  data: {
    inputValue: 0,
    oldValue: 0
  },
  // lifetimes: {
  //   attached: function () {
  //     this.setData({
  //       inputValue: this.getValue(this.props.value)
  //     })
  //   }
  // },
  didMount() { 
    this.attached();
  },
  didUpdate(prevProps, prevData) {
    const newVal = +this.props.value;
    if(!isNaN(Number(newVal)) && Number(newVal) !== Number(this.data.oldValue)){
      const val = this.getValue(+newVal)
      this.props.onChange({
        value: val, 
        index: this.data.index,
        params: this.data.params
      });
      this.setData({
        inputValue: val,
        oldValue: val
      })
    }
  },
  methods: {
    attached() {
      this.setData({
        inputValue: this.getValue(this.props.value),
        oldValue: this.getValue(this.props.value)
      })
    },
    onInput(e){
      const newVal = +e.detail.value;
      if(!isNaN(Number(newVal)) && Number(newVal) !== Number(this.data.oldValue)){
        const val = this.getValue(+newVal)
        this.props.onChange({
          value: val, 
          index: this.data.index,
          params: this.data.params
        });
        this.setData({
          value: val,
          oldValue:val
        })
      }
    },
    getScale(val, step) {
      let scale = 1;
      let scaleVal = 1;
      //浮点型
      if (!Number.isInteger(step)) {
        scale = Math.pow(10, (step + '').split('.')[1].length);
      }
      if (!Number.isInteger(val)) {
        scaleVal = Math.pow(10, (val + '').split('.')[1].length);
      }
      return Math.max(scale, scaleVal);
    },
    getValue(val) {
      val = Number(val)
      if (val < this.props.min) {
        val = this.props.min
      } else if (val > this.props.max) {
        val = this.props.max
      }
      return val
    },
    calcNum: function (type) {
      if (this.props.disabled || (this.data.inputValue == this.props.min && type === 'reduce') || (this.data.inputValue == this.data
          .max && type === 'plus')) return;
      const scale = this.getScale(Number(this.data.inputValue), Number(this.props.step));

      let num = Number(this.data.inputValue) * scale;
      let step = this.props.step * scale;
      if (type === 'reduce') {
        num -= step;
      } else if (type === 'plus') {
        num += step;
      }
      let value = Number((num / scale).toFixed(String(scale).length - 1));
      if (value < this.props.min) {
        value = this.props.min;
      } else if (value > this.props.max) {
        value = this.props.max;
      }
      this.props.onChange({
        value: value.toString(), 
        index: this.data.index,
        params: this.data.params
      });
      this.setData({
        inputValue: value.toString()
      })
    },
    plus: function () {
      this.calcNum('plus');
    },
    minus: function () {
      this.calcNum('reduce');
    },
    blur: function (e) {
      let value = e.detail.value;
      if (value && !isNaN(Number(value))) {
        if (~value.indexOf('.') && Number.isInteger(this.props.step) && Number.isInteger(Number(value))) {
          value = value.split('.')[0];
        }
        value = this.getValue(value)
      } else {
        value = this.data.oldValue;
      }
      setTimeout(() => {
        e.detail.value = value
        this.triggerEvent('blur', e.detail)
        this.setData({
          inputValue: value
        })
      }, this.props.type === 'text' ? 100 : 0)
    }
  }
})