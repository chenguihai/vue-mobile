<template>
  <div class="kf-btn" :class="{small:small}" @click="openQQ" v-if="!isWeChat">
    <van-icon :name="require('@/assets/service/qq.png')" :size="iconSize"/>
    <span>QQ交谈</span>
  </div>
  <a v-else class="kf-btn" target="_blank" :class="{small:small}" @click="openQQ"
     :href="`https://wpa.qq.com/msgrd?v=3&uin=${kfAcc}&site=qq&menu=yes`">
    <van-icon :name="require('@/assets/service/qq.png')" :size="iconSize"/>
    <span>QQ交谈</span>
  </a>
</template>

<script>
  import {browser} from '@/utils/tool'

  export default {
    name: 'kfBtn',
    props: ['small', 'kfAcc'],
    data() {
      return {
        isWeChat: browser.versions.isWeChat,
      }
    },
    computed: {
      iconSize() {
        return this.small ? '0.346rem' : '0.57rem'
      }
    },
    methods: {
      openQQ(e) {
        if (this.isWeChat) {
          this.$toast('微信环境不支持qq交谈\n' +
            '请点击右上角...在浏览器打开');
        } else if (!this.kfAcc) {
          this.$toast('暂无客服信息')
          e && e.preventDefault && e.preventDefault()
          return false
        }else{
          let url = `mqqwpa://im/chat?chat_type=wpa&uin=${this.kfAcc}&version=1&src_type=web&web_src=oicqzone.com`
          window.open(url)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .kf-btn {
    @include flex(center);
    @include borderBox;
    // width: 180px;
    // height: 56px;
    padding: 6px 16px;
    font-size: 28px;
    font-weight: 500;
    color: #113b4f;
    background: #aae0f9;
    @include round(4px);
    border: 1px solid #69bef1;

    span {
      margin-left: 10px;
    }

    &.small {
      // width: 140px;
      // height: 40px;
      padding: 5px;
      font-size: 22px;

      span {
        margin-left: 5px;
      }
    }
  }
</style>
