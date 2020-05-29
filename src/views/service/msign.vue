<template>
  <div class="can-box">
    <div class="left-con" ref="canvasHW">
      <div v-if="isSign && type == 'pc'" class="success-box">
        <img src="@/assets/service/icon_sign_mobile.png" alt />
        <p>手绘签名完成，请在PC上查看</p>
      </div>
      <canvas class="canvas-obj" v-if="!isSign" ref="canvasF" @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd' @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" :width="canW" :height="canH"></canvas>
      <!-- <img class="imgCanvas" :src="imgUrl"> -->
      <div v-if="!isSign" class="clear" @click="overwrite">
        <van-icon name="delete" size="0.41rem" />
        <p>删除</p>
      </div>
      <img v-if="!isSign" src="@/assets/service/bg_sign.png" class="can-bg" alt="" />
    </div>
    <div class="right-head">
      <van-icon name="cross" size="0.48" color="#fff" @click="$router.go(-1)" />
      <p class="head-txt">手绘个人签名</p>
      <p @click="commit">提交</p>
    </div>
  </div>
</template>
<script>
import { eSignUser, eSignUserRemove } from '@/api/service'
import { bodyColor } from '@/utils/mixins'
import { EventUtil } from '@/utils/tool'
export default {
  // middleware: ['auth'],
  // head() {
  //   return {
  //     title:"凌天众媒",
  //     meta:[
  //       {name:'apple-mobile-web-app-capable',content:'yes'},
  //       {name:'x5-fullscreen',content:'true'},
  //       {name:'screen-orientation',content:'portrait'},
  //       {name:'x5-orientation',content:'portrait'},
  //       {name:'fullscreen',content:'yes'}
  //     ]
  //   }

  // },
  data () {
    return {
      canW: 0,
      canH: 0,
      isEmpty: true,
      isSign: false,
      ordersn: this.$route.query.order_sn,
      // 签名的特殊token
      token: this.$route.query.token,
      // 是否PC端跳转过来的
      type: this.$route.query.type,
      imgUrl: '',
      client: {},
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      w: null,
      h: null,
      isDown: false
    }
  },
  mixins: [bodyColor('box100 fff')],
  mounted () {
    eSignUserRemove({ order_sn: this.ordersn, token: this.token })
    let canvas = this.$refs.canvasF
    let _this = this
   
    this.canH = this.$refs.canvasHW.offsetHeight
    this.canW = this.$refs.canvasHW.offsetWidth
    this.canvasTxt = canvas.getContext('2d')
    var evt = "onorientationchange" in window ? "orientationchange" : "resize";
    window.addEventListener(evt, function() {
        setTimeout( function(){
          _this.canH = _this.$refs.canvasHW.offsetHeight
            _this.canW = _this.$refs.canvasHW.offsetWidth
            _this.canvasTxt = canvas.getContext('2d')
        } ,50);
        
    }, false);
    // EventUtil.addHandler(window, 'orientationchange', this.lisSreen)
  },
  beforeDestory () {
    // EventUtil.removeHandler(window, 'orientationchange', this.lisSreen)
  },
  methods: {
    isWeiXin () {
      var ua = window.navigator.userAgent.toLowerCase()
      return ua.match(/MicroMessenger/i) == 'micromessenger'
    },
    CloseWebPage () {
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
          window.opener = null
          window.close()
        } else {
          window.open('', '_top')
          window.top.close()
        }
      } else if (navigator.userAgent.indexOf('Firefox') > 0) {
        window.location.href = 'about:blank '
      } else {
        window.opener = null
        window.open('', '_self', '')
        window.location.href = 'about:blank'
        window.close()
      }
    },
    close () {
      if (this.isWeiXin()) {
        WeixinJSBridge.call('closeWindow')
      } else {
        this.CloseWebPage()
      }
    },
    // mobile
    touchStart (ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clienX,
          y: ev.targetTouches[0].clientY
        }
        this.startX = obj.x
        this.startY = obj.y
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
      }
    },
    touchMove (ev) {
      ev = ev || event
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    },
    touchEnd (ev) {
      ev = ev || event
      this.isEmpty = false
      ev.preventDefault()
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX,
          y: ev.targetTouches[0].clientY
        }
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.points.push(obj)
      }
    },
    // pc
    mouseDown (ev) {
      ev = ev || event
      ev.preventDefault()
      let obj = {
        x: ev.offsetX,
        y: ev.offsetY
      }
      this.startX = obj.x
      this.startY = obj.y
      this.canvasTxt.beginPath()
      this.canvasTxt.moveTo(this.startX, this.startY)
      this.canvasTxt.lineTo(obj.x, obj.y)
      this.canvasTxt.stroke()
      this.canvasTxt.closePath()
      this.points.push(obj)
      this.isDown = true
    },
    mouseMove (ev) {
      ev = ev || event
      ev.preventDefault()
      if (this.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY
        }
        this.moveY = obj.y
        this.moveX = obj.x
        this.canvasTxt.beginPath()
        this.canvasTxt.moveTo(this.startX, this.startY)
        this.canvasTxt.lineTo(obj.x, obj.y)
        this.canvasTxt.stroke()
        this.canvasTxt.closePath()
        this.startY = obj.y
        this.startX = obj.x
        this.points.push(obj)
      }
    },
    mouseUp (ev) {
      ev = ev || event
      ev.preventDefault()
      let obj = {
        x: ev.offsetX,
        y: ev.offsetY
      }
      this.canvasTxt.beginPath()
      this.canvasTxt.moveTo(this.startX, this.startY)
      this.canvasTxt.lineTo(obj.x, obj.y)
      this.canvasTxt.stroke()
      this.canvasTxt.closePath()
      this.points.push(obj)
      this.points.push({ x: -1, y: -1 })
      this.isDown = false
    },
    // 重写
    overwrite () {
      this.canvasTxt.clearRect(0, 0, this.$refs.canvasF.width, this.$refs.canvasF.height)
      this.isEmpty = true
      this.points = []
    },
    // 提交签名
    async commit () {
      let _this = this
      this.imgUrl = this.$refs.canvasF.toDataURL()
      let data = {
        base: this.imgUrl.split(',')[1],
        order_sn: this.ordersn,
        token: this.token
      }
      if (!this.isEmpty) {
        const res = await eSignUser(data)
        console.log('commitRes', res)
        if (res.code != 200) return this.$toast(res.message)
        this.$toast('提交成功')
        this.isSign = true
        if (this.type == 'pc') {

        } else {
          this.$router.replace({ path: '/serviceContract', query: { sn: this.ordersn, token: this.token, type: 1, draw: 1 } })
        }
      } else {
        this.$message.error('您还未签名，请先完成签名后再提交。')
      }
    },
    lisSreen () {
      this.canH = this.$refs.canvasHW.offsetWidth
      this.canW = this.$refs.canvasHW.offsetHeight
    }
  }
}
</script>

<style scoped lang="scss">
.success-box {
  position: absolute;
  width: 450px;
  height: 241px;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -70px;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
  text-align: left;
  font-size: 30px;
}
.success-box img {
  display: block;
  margin: 0 auto;
  width: 260px;
  height: 282px;
  margin-bottom: 50px;
}
.can-box {
  width: 100%;
  height: 100%;
  @include flex;
  .right-head {
    background: #333;
    width: 80px;
    height: 100%;
    @include flex;
    flex-direction: column;
    font-size: 36px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    padding: 30px 0 50px 0;
    @include borderBox;
    p {
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
    }
    .head-txt {
      width: 220px;
      text-align: center;
    }
  }
  .left-con {
    flex: 1;
    height: 100%;
    position: relative;
    overflow: hidden;
    @include borderBox;
    .clear {
      @include flex;
      font-size: 30px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 42px;
      transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
      position: absolute;
      bottom: 60px;
      z-index: 1000;
      p {
        margin-left: 10px;
      }
    }
    .can-bg {
      width: 770px;
      height: 172px;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 0;
      transform-origin: 0 0;
      transform: rotate(90deg) translate(-50%, -50%);
      -ms-transform: rotate(90deg) translate(-50%, -50%);
      -moz-transform: rotate(90deg) translate(-50%, -50%);
      -webkit-transform: rotate(90deg) translate(-50%, -50%);
      -o-transform: rotate(90deg) translate(-50%, -50%);
    }
    canvas{
      z-index:1;
      position: relative;
    }
  }
}
// @media screen and (orientation: portrait) {
// 	/* 竖屏 */
// }
@media screen and (orientation: landscape) {
  /* 横屏 */
  .success-box {
    position: absolute;
    width: 200px;
    height: 141px;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -70px;
    text-align: center;
  }
  .success-box img {
    display: block;
    margin: 0 auto;
    width: 130px;
    height: 141px;
  }
  .can-box {
    flex-direction: column;
    .right-head {
      order: -1;
      width: 100%;
      height: 80px;
      flex-direction: row;
      padding: 0 30px;
      p {
        transform: none;
        -ms-transform: none;
        -moz-transform: none;
        -webkit-transform: none;
        -o-transform: none;
        filter: none;
      }
    }
    .left-con {
      height: auto;
      width: 100%;
      .clear {
        transform: none;
        -ms-transform: none;
        -moz-transform: none;
        -webkit-transform: none;
        -o-transform: none;
        filter: none;
        right: 30px;
      }
      .can-bg {
        transform: rotate(0deg) translate(-50%, -50%);
        -ms-transform: rotate(0deg) translate(-50%, -50%);
        -moz-transform: rotate(0deg) translate(-50%, -50%);
        -webkit-transform: rotate(0deg) translate(-50%, -50%);
        -o-transform: rotate(0deg) translate(-50%, -50%);
      }
    }
  }
}
</style>
