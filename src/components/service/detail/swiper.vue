<template>
  <div class="service-swiper-box">
    <van-swipe indicator-color="#F3262D" class="service-detail-swiper" @change="swiperBoxChange">
      <van-swipe-item v-if="video">
        <div class="video-p-box">
          <video-player class="video-player-box detail-img video-box" ref="videoPlayer1" :options="playerOptions" :playsinline="true" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @statechanged="playerStateChanged($event)" @ready="playerReadied">
          </video-player>
          <div class="video-event-mask" v-if="videoEventMaskShow" @click="preview"></div>
        </div>
      </van-swipe-item>
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <van-image @click="preview" class="detail-img" :noOss="false" :lazy-load="true" :src="image.url+'?x-oss-process=image/resize,m_fill,h_248,w_414'" />
      </van-swipe-item>
    </van-swipe>
    <van-image-preview v-model="showPreview" :startPosition="nowSwiperIndex" :images="previewImgs" @change="previewBoxChange" @close="previewClose">
      <video-player v-if="video" slot="cover" class="video-player-box detail-img video-box pre-video" ref="videoPlayer2" :options="playerOptions" :playsinline="true" @pause="onPlayerPause2($event)" @statechanged="playerStateChanged($event)" @ready="playerReadied2">
      </video-player>
    </van-image-preview>
  </div>
</template>

<script>
import Vue from 'vue'
import { videoPlayer } from 'vue-video-player'
import { ImagePreview } from '@/components/nvan'
// require videojs style
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
Vue.use(ImagePreview)

export default {
  name: 'serviceDetailSwiper',
  props: ['images', 'video'],
  data () {
    return {
      showPreview: false,
      videoEventMaskShow: true,
      nowSwiperIndex: 0,
      nowPreviewIndex: null,
      pauseSwiperIndex: 0,
      index: 0,
      videoInfoHis: {
        time: 0,
        pause: false,
        hisplaying: false, // 历史状态
        playing: false
      },
      video1: null,
      video2: null
    }
  },
  computed: {
    previewImgs () {
      if (!this.images) return []
      const ali = this.$store.state.ali_api_host
      const imgs = this.images.map(o => ali + '/' + o.url)
      return this.video ? ['_video', ...imgs] : imgs
    },
    playerOptions () {
      if (!this.video) return {}
      let mime = this.video.split('.')
      let mimeType = mime[mime.length - 1]
      return {
        // videojs options
        muted: true,
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: `video/${mimeType}`,
          src: `${this.$store.state.ali_api_host}${this.video}`
        }],
        // poster: '/static/images/author.jpg',
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  components: {
    videoPlayer,
    ImagePreview
  },
  methods: {
    swiperBoxChange (index) {
      // 如果是视频 并且划走之前是播放状态
      this.nowSwiperIndex = index
      const { hisplaying, pause } = this.videoInfoHis
      if (index !== 0 && hisplaying && !pause && this.video1) {
        this.video1.pause()
      }
      if (index === 0 && hisplaying && this.video1) {
        this.video1.play()
      }
    },
    previewBoxChange (index) {
      // 如果是视频 并且划走之前是播放状态
      this.nowPreviewIndex = index
      const { hisplaying, pause } = this.videoInfoHis
      if (index !== 0 && hisplaying && !pause && this.video2) {
        this.video2.pause()
      }
      if (index === 0 && hisplaying && this.video2) {
        this.video2.play()
      }
    },
    previewClose () {
      this.nowPreviewIndex = null
      // 时间同步
      this.video1.currentTime(this.videoInfoHis.time)
    },
    preview () {
      this.showPreview = true
      this.video1.pause()
      this.nowPreviewIndex = 0
      // 预览 暂停轮播视频
    },
    onChange (index) {
      this.index = index
    },
    onPlayerPlay (player) {
      this.videoEventMaskShow = false
    },
    onPlayerPause (player) {
      if (this.nowSwiperIndex === this.pauseSwiperIndex) {
        this.videoInfoHis.hisplaying = false
      }
      this.videoEventMaskShow = true
    },
    onPlayerPause2 (player) {
      if (this.nowPreviewIndex === this.pauseSwiperIndex) {
        this.videoInfoHis.hisplaying = false
      }
    },
    playerStateChanged (playerCurrentState) {
      const { timeupdate, playing, pause, waiting } = playerCurrentState
      if (timeupdate) this.videoInfoHis.time = timeupdate
      if (playing || waiting) {
        this.videoInfoHis.hisplaying = true
        this.videoInfoHis.playing = true
        this.videoInfoHis.pause = false
      }
      if (pause) {
        this.videoInfoHis.playing = !pause
        this.videoInfoHis.pause = pause
      }
    },
    playerReadied (player) {
      this.video1 = player
    },
    playerReadied2 (player) {
      this.video2 = player
      const { hisplaying, time } = this.videoInfoHis
      if (this.nowPreviewIndex === 0 && hisplaying && this.showPreview) {
        this.video2.currentTime(time)
        this.video2.play()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.video-p-box {
  position: relative;
  height: 450px;
  .video-event-mask {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}

.service-swiper-box {
  .service-detail-swiper {
    width: 100%;
    height: 450px;
    /deep/ .van-swipe__indicator {
      background-color: #999999;
      opacity: 0.99;
    }
    .detail-img {
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .van-image-preview__cover {
    width: 100%;
    height: 6rem;
    top: 0;
    bottom: 0;
    margin: auto;
    .pre-video {
      width: 100%;
    }
  }

  .video-box {
    /deep/ .video-js {
      width: 100%;
      height: 100%;
    }
    /deep/ .vjs-big-play-button {
      @include round(50%);
      @include borderBox;
      @include square(110);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      z-index: 20;
      .vjs-icon-placeholder::before {
        top: 0;
        bottom: 0;
        margin: auto;
        width: 0;
        height: 0;
        content: " ";
        border-left-width: 48px;
        border-top-width: 29px;
        border-bottom-width: 29px;
        border-right-width: 0;
        border-style: solid;
        border-left-color: #fff;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-top-color: transparent;
        margin-left: 38px;
      }
    }

    /deep/ .vjs-control-bar {
      z-index: 20;
      .vjs-button > .vjs-icon-placeholder::before {
        @include flex(center);
      }
    }
  }
}
</style>
