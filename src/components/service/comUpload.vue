<template>
  <div>
    <div class="com-up-box" :class="{_upload:fileLoading}">
      <div class="up-pre" v-for="(item, idx) in fileList" :key="idx" @click="viewImg(idx)">
        <van-icon class="del-icon" name="clear" size="0.346rem" color="#848484" @click.stop="beforeFileRemove(idx)"/>
        <van-image class="preview-img" :src="item.url" :noOss="false"/>
      </div>
      <van-loading v-if="fileLoading" class="pro" size="24px" vertical>拼命上传中...</van-loading>
      <van-uploader v-if="fileList.length < fileLimit" class="upload" :class="{fup:fileList.length === 0}"
                    :multiple="multiples" :max-size="maxFileSize" :max-count="fileLimit - fileList.length"
                    :preview-image="false" preview-size="1.6rem" :after-read="afterFile" :before-read="beforeRead"
                    :oversize="moreSize">
        <div class="up-box">
          <img class="up-icon" src="@/assets/service/canm.png">
          <p>添加图片</p>
        </div>
      </van-uploader>
    </div>
    <slot name="tips">
      <div class="need-tip">
        <p>最多可添加5个附件，每个附件不超过50M。</p>
        <p>如果需要上传非图片附件请在电脑端操作</p>
      </div>
    </slot>
  </div>
</template>

<script>
  import {uploadMixin} from '@/utils/mixins'
  import {ImagePreview} from '@/components/nvan'

  export default {
    name: 'comUpload',
    mixins: [uploadMixin()],
    props: {
      multiples: {
        type: Boolean,
        default: false
      },
      max: {// 最大上传数
        type: Number,
      }
    },
    computed: {
      imgHost() {
        return this.$store.state.ali_api_host
      }
    },
    methods: {
      viewImg(idx) {
        ImagePreview({
          images: this.fileList.map(file => file.url ? `${this.imgHost}/${file.url}` : file.content),
          startPosition: idx
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .com-up-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
  }

  .up-box {
    @include square(120);
    @include flex(center);
    @include borderBox;
    flex-direction: column;
    border: 1px solid #ccc;

    p {
      font-size: 22px;
      font-family: $font;
      font-weight: 400;
      color: #adadad;
      margin-top: 6px;
    }

    .up-icon {
      width: 49px;
      height: 44px;
    }
  }

  .need-tip {
    margin-top: 20px;
    font-size: 20px;
    font-family: $font;
    font-weight: 400;
    line-height: 28px;
    margin-bottom: 30px;
    color: #999;
  }

  .upload {
    margin-left: 22px;

    &.fup {
      margin-left: 0;
    }
  }

  ._upload {
    position: relative;
    overflow: hidden;

    .pro {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      margin: auto;
      z-index: 10;
      width: 100%;
      @include flex(center);
    }
  }

  .up-pre {
    @include square(120);
    position: relative;
    margin-bottom: 10px;
    margin-top: 10px;

    &:not(:nth-child(5n+5)) {
      margin-right: 22px;
    }

    /*&:first-child {*/
    /*  margin-left: 0;*/
    /*}*/

    .preview-img {
      width: 100%;
      height: 100%;
    }

    .del-icon {
      position: absolute;
      top: -13px;
      right: -13px;
      z-index: 2;
    }
  }
</style>
