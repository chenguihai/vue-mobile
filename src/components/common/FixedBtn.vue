<template>
  <!--  :style="!hidshow?'display:none':'display:block'"-->
  <div :class="wrapClass">
    <slot></slot>
    <van-button plain :class="['btn',{'invitation':this.name==='邀请好友'},{'disabled':disabled}]" @click="onsubmit">{{btnName}}</van-button>
  </div>
</template>

<script>
/**
     *     <fixed-btn name="删除" @submit="_handleSubmit" fixed="0"></fixed-btn>
     使用方法
     *     1、必填  传入按钮的名字
     *     2、必填  传一个回调方法
     *     3、可选 disabled属性
     *     4、可选 底部按钮布局方式 0 fixed 1 fit 2 flow 3 flow_full 全屏
     *     5、可选 slot可以传入说明内容如  <p class="reminder">温馨提示 <br>sfasdfasdff</p>
     */
export default {
  name: "FixedBtn",
  props: {
    name: {
      type: String,
      reqirue: true
    },
    fixed: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      docmHeight: "0",
      showHeight: "0",
      hidshow: true,
      btnName: this.name,
      layout: this.fixed,
      classArray: ["fixed_wrap", "fit_wrap", "flow_wrap", "flow_full"]
    };
  },
  computed: {
    wrapClass() {
      return this.classArray[this.layout];
    }
  },
  methods: {
    onsubmit() {
      this.$emit("submit");
    }
  },
  watch: {
    showHeight: function() {
      if (this.docmHeight > this.showHeight) {
        this.hidshow = false;
      } else {
        this.hidshow = true;
      }
    }
  },
  mounted() {
    this.docmHeight = document.documentElement.clientHeight;
    window.onresize = () => {
      return (() => {
        // 实时屏幕高度
        this.showHeight = document.documentElement.clientHeight;
      })();
    };
  }
};
</script>

<style scoped lang="scss">
.fixed_wrap,
.fit_wrap {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;

  .reminder {
    font-size: 26px;
    color: $c_999;
    line-height: 37px;
    padding: 0 $w_15 $w_30;
  }

  .btn {
    width: 100%;
    height: 98px;
    font-size: 30px;
    color: $white;
    text-align: center;
    background: $red;
    &.disabled {
      background-color: $btn_dis;
    }
  }
  .invitation {
    background: #ffbe00;
    border: none;
  }
}

.fixed_wrap {
  bottom: 0;
}

.fit_wrap {
  background-color: $white;
  padding: 40px $w_30;
  /*bottom: 40px;*/
  bottom: 0;
  border-radius: 2px;
}

.flow_wrap,
.flow_full {
  .btn {
    width: 100%;
    height: 88px;
    font-size: 30px;
    border-radius: 8px;
    color: $white;
    text-align: center;
    line-height: 50px;
    background: $red;

    &.disabled {
      background-color: $btn_dis;
    }
  }
}

.flow_wrap {
  padding: $w_30;
}
</style>
