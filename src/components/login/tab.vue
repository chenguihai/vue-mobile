<template>
  <ul class="login-tab">
    <li class="tab" @click="$emit('change', idx)" :class="{active: active === idx}" v-for="(item, idx) in tabs" :key="idx">{{item}}</li>
  </ul>
</template>

<script>
export default {
  /**
   * @Description: 登录切换
   * @param {
   * tabs 切换的数组
   * active 当前集火的下标
   * }
   * @return:
   * @Date: 2019-11-12 14:52:10
   * @LastEditors: Eve
   * @LastEditTime: Do not edit
   */
  name: 'loginTab',
  props: {
    tabs: Array,
    active: {
      type: Number,
      default: 0
    }
  },
  model: {
    prop: 'active',
    event: 'change'
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.login-tab {
  font-size: $font;
  @include flex();
  position: relative;
  @include borderBox;
  &::after {
    position: absolute;
    height: 3px;
    background: #ccc;
    bottom: 0;
    left:20px;
    right:20px;
    margin:auto;
    content:' ';
    display:block;
    z-index:1;
  }
  .tab {
    flex:1;
    text-align: center;
    padding:0 35px;
    padding-bottom: 30px;
    font-size: 28px;
    font-weight: 400;
    z-index:2;
     border-bottom: 3px solid rgba(255,255,255,0);
    &.active {
      border-bottom: 3px solid rgba(243,38,45,1);
      color: $red;
    }
  }
  
  
}
</style>
