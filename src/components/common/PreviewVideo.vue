<template>
  <div class="container">
    <van-popup v-model="showFlag" position="right"
               @close="$emit('close')" :style="{ height: '100%' }">
      <van-sticky class="wrap" :z-index="9999999">
        <div class="fix_top">
          <span>视频预览</span>
          <i class="closeIcon" @click="$emit('close')"></i>
        </div>
      </van-sticky>
      <video controls autoplay class="video_wrap" :src="ali_api_host+url">您的浏览器不支持 video 标签。</video>
    </van-popup>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "PreviewVideo",
    props: {
      url: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        showFlag: true
      }
    },
    computed: {
      ...mapState(['ali_api_host']),
    },
  }
</script>

<style scoped lang="scss">
  .container {
    .video_wrap {
      width: 100%;
      height: 100%;
      display: block;
    }

    .fix_top {
      position: fixed;
      top: 20px;
      left: 0;
      right: 0;
      z-index: 900000;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: $white;
      background-color: $c_666;
      font-size: 28px;
      padding-right: 30px;
    }

    .closeIcon {
      float: right;
      width: 36px;
      height: 36px;
      margin-top: 7px;
      background: url("/static/images/white_delete.png") no-repeat center;
      background-size: 36px 36px;
    }

    .van-popup {
      width: 100%;
    }
  }
</style>
