<template>
  <div class="identity-box">
    <van-swipe class="swipe-box" @change="swipeChange" :initial-swipe="role">
      <van-swipe-item class="identity">
        <a tag="div" href="/" replace class="ignore">跳过</a>
        <img :src="gzImg" class="avatar">
        <p class="title">我是雇主（广告主）</p>
        <p class="sub-title">I AM AN EMPLOYER</p>
        <van-divider class="divider" :style="{ color: '#333', borderColor: '#979797', padding: '0 18px' }">雇主身份介绍</van-divider>
        <div class="info-box">
          <p v-for="(item, index) in gzInfoArr" :key="index">
            {{item}}
          </p>
        </div>
        <a tag="div" replace :href="'/userContent/homePage/homePage?type=1'" class="btn">完善资料</a>
      </van-swipe-item>
      <van-swipe-item class="identity">
        <a tag="div" href="/" replace class="ignore">跳过</a>
        <img :src="fwsImg" class="avatar">
        <p class="title">我是凌客（服务商）</p>
        <p class="sub-title">I AM A SERVICE PROVIDER</p>
        <van-divider class="divider" :style="{ color: '#333', borderColor: '#979797', padding: '0 18px' }">凌客身份介绍</van-divider>
        <div class="info-box">
          <p v-for="(item, index) in fwsInfoArr" :key="index">
            {{item}}
          </p>
        </div>
         <a tag="div" replace :href="'/userContent/homePage/homePage?type=2'" class="btn">开通店铺</a>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
const gzImg = require('@/assets/login/gz.png')
const fwsImg = require('@/assets/login/fws.png')
const gzInfoArr = [
  '相当于电商平台的买家身份，可以在平台雇佣各种服务商为其进行服务，需支付一笔佣金作为服务商的报酬。',
  '雇主可以发布任务，让服务商主动参与，雇主选择符合条件的服务商为其服务。',
  '同时广告主也可以发布广告线索快速获取所需要的媒体资源信息。'
]
const fwsInfoArr = [
  '相当于电商平台的卖家身份，可以在平台选择技能记性赋能，赋能后在该技能类目下开始自己的店铺，从此开店接单赚钱。',
  '当凌客成为技能者后，可以去雇主发布的任务投标 当中标后，会获取一定的赏金奖励。',
  '同时也可以去广告主发布的线索帖子中购买广告线索，获取更多一手广告主信息，赢取大单。走上人生致富路。'
]
export default {
  name: 'identity',
  data () {
    return {
      role: 0,
      gzInfoArr,
      fwsInfoArr,
      gzImg,
      fwsImg
    }
  },
  computed: {
    avatar () {
      return this.role === 0 ? gzImg : fwsImg
    },
    title () {
      return this.role === 0 ? '我是雇主（广告主）' : '我是凌客（服务商）'
    },
    subTitle () {
      return this.role === 0 ? 'I AM AN EMPLOYER' : 'I AM ASERVICE PROVIDER'
    },
    dividerText () {
      return this.role === 0 ? '雇主身份介绍' : '凌客身份介绍'
    },
    infoArr () {
      return this.role === 0 ? gzInfoArr : fwsInfoArr
    },
    btnText () {
      return this.role === 0 ? '完善资料' : '开通店铺'
    }
  },
  methods: {
    swipeChange (idx) {
      this.role = idx
    }
  }
}
</script>

<style scoped lang="scss">
.identity-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 100%;
  margin: auto;
  @include flex(center, center);
  @include borderBox;
  padding: 24px 20px;
  background: #f4f6f8;
  .swipe-box {
    width: 100%;
    height: 100%;
  }
  .identity {
    width: 100%;
    height: 100%;
    background: #fff;
    @include flex(flex-start, center);
    flex-direction: column;
    position: relative;
    .ignore {
      @include square(58);
      @include round;
      @include borderBox;
      text-align: center;
      line-height: 58px;
      border: 1px solid #979797;
      position: absolute;
      right: 41px;
      top: 35px;
      font-size: 22px;
      font-family: $font;
      font-weight: 400;
      color: #666;
    }

    /* 中间主体 */

    .avatar {
      @include square(84);
      margin-top: 51px;
    }
    .title {
      font-size: 28px;
      font-family: $font;
      font-weight: 400;
      margin-top: 36px;
      line-height: 40px;
      color: #333;
      text-align: center;
    }
    .sub-title {
      font-size: 20px;
      font-family: $font;
      font-weight: 400;
      color: #999;
      text-align: center;
      line-height: 28px;
    }
    .divider {
      margin-top: 28px;
      font-size: 24px;
      font-family: $font;
      font-weight: 400;
      width: 300px;
    }
    .info-box {
      margin-top: 21px;
      width: 353px;
      font-size: 24px;
      font-family: $font;
      font-weight: 400;
      line-height: 33px;
      p {
        margin-top: 42px;
        &:first-child {
          margin-top: 0;
        }
      }
    }
    .btn {
      width: 250px;
      height: 70px;
      background: $red;
      @include round(4px);
      margin-top: 84px;
      font-size: 24px;
      font-family: $font;
      font-weight: 400;
      text-align: center;
      line-height: 70px;
      color: #fff;
    }
  }
}
</style>
