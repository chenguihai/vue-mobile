<template>
  <div class="job-upload">
    <div class="loading-box" v-if="fileLoading">
      <van-loading size="0.5rem" text-size="0.346rem">拼命上传中...</van-loading>
    </div>
    <van-uploader :preview-image="false" :max-count="fileLimit" :max-size="maxFileSize" :after-read="afterFile" :accept="accept">
      <div class="up-box">
        <div class="up-btn">上传附件</div>
        <p>最多可添加5个附件，每个大小不超过500M</p>
      </div>
    </van-uploader>
  </div>
</template>

<script>
import { uploadMixin } from '@/utils/mixins'

export default {
  name: 'jobUpload',
  mixins: [uploadMixin({ url: '/api/service/uploadFiles' })],
  props: ['type'],
  data () {
    return {
      orderSn: this.$route.query.sn
    }
  },
  computed: {
    othOpts () {
      return {
        order_sn: this.orderSn,
        type: this.type,
        [this.reqFileName]: {
          name: 'files',
          extra: { code: 200 }
        }
      }
    },
    accept () {
      return this.type === 1 ? 'image/*' : 'image/*,application/*'
    }
  },
  methods: {
    fileUploadSuccess () {
      this.$emit('update')
    }
  }
}
</script>

<style scoped lang="scss">
.job-upload {
  position: relative;
  .loading-box {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.7);
    @include flex(center);
    z-index: 3;
  }
}
/* 上传 */
.up-box {
  @include flex(flex-start);
  margin-top: 10px;
  font-size: 22px;
  font-family: $font;
  font-weight: 400;
  color: #999;
  .up-btn {
    width: 153px;
    height: 58px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(243, 38, 45, 1);
    line-height: 58px;
    text-align: center;
    font-size: 26px;
    margin-right: 10px;
    color: $red;
    @include borderBox;
    &.dis-btn {
      background: #ddd;
      cursor: not-allowed;
      border: none;
      color: #fff;
      pointer-events: none;
    }
  }
}
</style>
