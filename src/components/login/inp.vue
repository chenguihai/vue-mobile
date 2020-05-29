<template>
  <div class="login-inp">
    <slot name="icon">
      <img class="inp-icon" :src="iconUI" />
    </slot>
    <div class="inp-box">
      <form action autocomplete="off" style="width:100%">
        <input
          :type="type"
          :value="value"
          :placeholder="placeholder"
          :maxlength="maxLength"
          @input="$emit('change', $event.target.value)"
          @blur="$emit('onBlurs')"
          @focus="$emit('onFocus')"
          v-bind="othProps"
        />
      </form>
      <van-icon
        name="clear"
        size="0.346rem"
        class="cancel-icon"
        color="#CCCCCC"
        @click="$emit('change', '')"
        v-if="value"
      />
    </div>
    <div
      class="btn"
      :class="{active:btnActive}"
      v-if="btnText"
      @click.stop="$emit('btnClick')"
    >{{btnText}}</div>
  </div>
</template>

<script>
const iconP = require("@/assets/login/iPhone.png");
const iconM = require("@/assets/login/mima.png");
const iconY = require("@/assets/login/yanzhenma.png");
export default {
  name: "loginInp",
  props: {
    type: {
      type: String,
      default: "text"
    },
    btnText: String, // 按钮文字
    btnActive: Boolean, // 按钮激活
    value: [String, Number],
    placeholder: String,
    icon: [String, Number],
    othProps: {
      type: Object,
      default: () => ({})
    },
    maxLength: {
      type: Number | String,
      default: 32
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {};
  },
  computed: {
    iconUI() {
      // 1手机 2密码 3验证码
      switch (this.icon) {
        case 3:
          return iconY;
        case 2:
          return iconM;
        case 1:
          return iconP;
        default:
          return this.icon;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.login-inp {
  @include flex(flex-start);
  @include borderBox;
  padding: 0 15px;
  padding-bottom: 20px;
  margin: auto;
  border-bottom: 1px solid #ccc;
  .inp-icon {
    @include square(40);
  }
  .inp-box {
    flex: 1;
    @include flex;
    input {
      flex: 1;
      padding: 0 10px;
      width: 100%;
      font-size: 28px;
      line-height: 40px;
      &::placeholder {
        font-family: $font;
        font-weight: 400;
        color: #ccc;
      }
    }
    .cancel-icon {
      @include square(25);
      margin-right: 60px;
    }
  }

  .btn {
    min-width: (194 - 22) px;
    height: 28px;
    font-size: 28px;
    line-height: 28px;
    font-weight: 400;
    color: #999;
    padding: 0 16px;
    border-left: 1px solid #ccc;
    pointer-events: none;
    &:active,
    &.active {
      color: $red;
      pointer-events: auto;
    }
  }
}
</style>
