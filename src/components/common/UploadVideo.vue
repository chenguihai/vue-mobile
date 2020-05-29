<template>
  <div>
    <div class="com-up-box" :class="{_upload:fileLoading}">
      <div class="up-pre" v-for="(item, idx) in fileList" :key="idx" @click="previewVideo(item.url)">
        <van-icon class="del-icon" name="clear" size="0.346rem" color="#848484" @click.stop="beforeFileRemove(idx)"/>
        <video class="video_wrap" :src="ali_api_host+item.url">您的浏览器不支持 video 标签。</video>
        <i class="playIcon"></i>
      </div>
      <van-loading v-if="fileLoading" class="pro" size="24px" vertical>拼命上传中...</van-loading>
      <!--                    accept="video/*"-->
<!--      accept=".mp4,.Ogg,.MPEG4,.WebM"-->
      <van-uploader v-if="fileList.length < fileLimit" class="upload" :class="{fup:fileList.length === 0}"
                    accept="video/*"
                    :max-size="maxFileSize" :max-count="fileLimit - fileList.length" :preview-image="false"
                    preview-size="1.6rem" :after-read="afterFile" :before-read="beforeRead" :oversize="moreSize">
        <div class="up-box">
          <img class="up-icon" src="@/assets/service/canm.png">
          <p>添加视频</p>
        </div>
      </van-uploader>
    </div>
    <!--
    <slot name="tips">
      <div class="need-tip">
        <p class="mb_10">最多可添加5个附件，每个附件不超过50M。</p>
        <p>如果需要上传非图片附件请在电脑端操作</p>
      </div>
    </slot>
    -->
    <preview-video v-if="videoFlag" :url="fileList[0].url" @close="videoFlag=false"></preview-video>
  </div>
</template>

<script>
  import {uploadMixinVideo} from '@/utils/mixins'
  import PreviewVideo from "./PreviewVideo";
  import {mapState} from 'vuex'

  export default {
    name: 'UploadVideo',
    mixins: [uploadMixinVideo()],
    props: [
      'max' // 最大上传数
    ],
    components: {PreviewVideo},
    computed: {
      ...mapState(['ali_api_host']),
    },
    data() {
      return {
        videoFlag: false
      }
    },
    methods: {
      previewVideo(url) {
        this.videoFlag = true;
      },
    }
  }
</script>

<style scoped lang="scss">
  .com-up-box {
    @include flex(flex-start);
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
    margin-left: 22px;
    position: relative;

    &:first-child {
      margin-left: 0;
    }

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

    .playIcon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      width: 50px;
      height: 50px;
      background: url("/static/images/play.png") no-repeat center;
      background-size: 50px 50px;
    }
  }

  .video_wrap {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
