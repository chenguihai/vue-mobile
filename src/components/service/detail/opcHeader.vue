<template>
  <div class="opc-header" ref="opcHeader" :style="opcScrollStyle">
    <div class="opc-left" :style="iconScrollStyle" @click="$router.go(-1)">
      <van-icon name="arrow-left" size="0.48rem" :color="iconColor"/>
    </div>
    <div class="nav-center" :style="navScrollStyle">
      <a class="nav-item" :class="{active:nowPosition === 1}" href="#serviceDetailInfo">
        <van-icon v-if="nowPosition === 1" name="location" color="#F3262D" size="0.26rem"/>
        <p>服务</p>
      </a>
      <a class="nav-item" :class="{active:nowPosition === 2}" href="#serviceDetailComment">
        <van-icon v-if="nowPosition === 2" name="location" color="#F3262D" size="0.26rem"/>
        <p>评价</p>
      </a>
      <a class="nav-item" :class="{active:nowPosition === 3}" href="#serviceDetailStore">
        <van-icon v-if="nowPosition === 3" name="location" color="#F3262D" size="0.26rem"/>
        <p>店铺精选</p>
      </a>
      <a class="nav-item" :class="{active:nowPosition === 4}" href="#serviceDetailCon">
        <van-icon v-if="nowPosition === 4" name="location" color="#F3262D" size="0.26rem"/>
        <p>详情</p>
      </a>
    </div>
    <div class="opc-right" :style="iconScrollStyle" @click="showMenu = true">
      <van-icon name="weapp-nav" size="0.48rem" :color="iconColor"/>
    </div>
    <MenuSlide @close="showMenu = false" v-if="showMenu"></MenuSlide>
  </div>
</template>

<script>
  import {EventUtil} from '@/utils/tool'
  import MenuSlide from '@/components/common/MenuSlide'

  export default {
    name: 'opcHeader',
    components: {MenuSlide},
    props: {},
    data() {
      return {
        selfHeight: 0,
        scrollTop: 0,
        swiperTop: 0,
        swiperDom: null,
        infoDom: null,
        commentDom: null,
        storeDom: null,
        conDom: null,
        conTop: null,
        storeTop: null,
        commentTop: null,
        infoTop: null,
        showMenu: false
      }
    },
    computed: {
      nowPosition() {// 区域定位
        if (!this.conDom) return 0
        if (!!this.conTop && this.conTop < 540) {
          return 4;
        }
        if (this.conTop - this.selfHeight <= 0) return 4
        if (this.storeTop - this.selfHeight <= 0) return 3
        if (this.commentTop - this.selfHeight <= 0) return 2
        if (this.infoTop - this.selfHeight <= 0) return 1
      },
      iconColor() {
        return this.journey > 0.5 ? '#999' : '#fff'
      },
      opcScrollStyle() {
        return {background: `rgba(255, 255, 255, ${this.journey})`}
      },
      iconScrollStyle() {
        return {background: `rgba(153, 153, 153, ${1 - this.journey})`}
      },
      navScrollStyle() {
        return {opacity: this.journey}
      },
      journey() {
        if (!this.swiperDom) return 0
        let diff = this.swiperDom.offsetHeight - this.scrollTop
        diff = diff < 0 ? 0 : diff
        let ratio = (diff / this.swiperDom.offsetHeight).toFixed(2)
        ratio = ratio <= 0 ? 0 : ratio > 1 ? 1 : ratio
        return (100 - ratio * 100) / 100
      }
    },
    mounted() {
      EventUtil.addHandler(window, 'scroll', this.scrollEvent, true)
      this.selfHeight = this.$refs.opcHeader.offsetHeight
      this.$emit('mounted', this.selfHeight)
      // this.selfHeight = document.body.clientHeight
      this.swiperDom = document.querySelector('.detail .service-swiper-box')
      this.infoDom = document.querySelector('#serviceDetailInfo')
      this.commentDom = document.querySelector('#serviceDetailComment')
      this.storeDom = document.querySelector('#serviceDetailStore')
      this.conDom = document.querySelector('#serviceDetailCon')
    },
    beforeDestroy() {
      EventUtil.removeHandler(window, 'scroll', this.scrollEvent, true)
    },
    methods: {
      scrollEvent() {
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        this.infoTop = this.infoDom.getBoundingClientRect().top
        this.commentTop = this.commentDom.getBoundingClientRect().top
        this.storeTop = this.storeDom.getBoundingClientRect().top
        this.conTop = this.conDom.getBoundingClientRect().top
      }
    }
  }
</script>

<style scoped lang="scss">
  .opc-header {
    width: 100%;
    height: 88px;
    @include flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    @include borderBox;
    padding: 18px 20px;
    z-index: 10;
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    background: rgba(255, 255, 255, 0);

    .opc-left,
    .opc-right {
      @include square(50);
      @include round(50%);
      @include flex(center);
      background: rgba(153, 153, 153, 1);
    }

    .nav-center {
      @include flex;
      flex: 1;
      opacity: 0;

      .nav-item {
        flex: 1;
        @include flex(center);

        &.active {
          color: $red;
        }
      }
    }
  }
</style>
