<template>
  <div class="container bg">
    <head-nav title="新手任务"></head-nav>
    <!--店铺-->
    <div class="store_status clearFix">
      <van-image v-if="storeInfo.avatar" round fit="cover" class="logo" :src="storeInfo.avatar" :noOss="false"
                 :lazy-load="true"></van-image>
      <van-image v-if="storeInfo.logo" round fit="cover" class="logo" :src="storeInfo.logo" :noOss="false"
                 :lazy-load="true"></van-image>
      <img v-else class="logo" src="@/assets/default/shop.png" alt/>
      <div class="store_wrap">
        <h4 class="name">{{storeInfo.store_name || (userInfo.original && userInfo.original.nick_name)}}</h4>
        <!--未开通-->
        <div class="level" v-if="storeInfo.isStore === 0">
          <span>店铺状态：</span>
          <span class="red mr_70">未开通</span>
        </div>
        <!--状态：0 待审核 1 审核成功 -1 审核失败 -2 店铺关闭-->
        <!--待审核-->
        <div class="level" v-else-if="storeInfo.status === 0">
          <span>店铺状态：</span>
          <span class="red mr_70">待审核</span>
        </div>
        <!--已开通-->
        <div class="level" v-else-if="storeInfo.status === 1">
          <span>店铺状态：</span>
          <span class="red mr_70">已开通</span>
        </div>
        <!--未通过-->
        <div class="level" v-else-if="storeInfo.status === -1">
          <span>店铺状态：</span>
          <span class="red mr_70">未通过</span>
          <span class="blue" @click="openStore">申请开通</span>
          <img class="arrow" src="@/assets/auth/arrow_right.png" alt="">
        </div>
        <!--已关闭-->
        <div class="level" v-else-if="storeInfo.status === -2">
          <span>店铺状态：</span>
          <span class="red mr_70">已关闭</span>
          <span class="blue" @click="openStore">申请开通</span>
          <img class="arrow" src="@/assets/auth/arrow_right.png" alt="">
        </div>
      </div>
    </div>
    <!--错误信息 未通过-->
    <p class="error_info" v-if="storeInfo.status === -1">
      未通过原因：<span>{{storeInfo.remarks}}</span>
    </p>
    <p class="error_info" v-if="storeInfo.status === -2">
      关闭原因：<span>{{storeInfo.close_reason}}</span>
    </p>
    <!--广告-->
    <ul class="banner_wrap">
      <li class="banner_item" @click="routerJump(0)">
        <van-image fit="cover" class="logo" :src="leftImg.ad_img" :noOss="false"
                   :lazy-load="true"></van-image>
      </li>
      <li class="banner_item" @click="routerJump(1)">
        <van-image fit="cover" class="logo" :src="rightImg.ad_img" :noOss="false"
                   :lazy-load="true"></van-image>
      </li>
    </ul>
    <!--信息列表-->
    <ul class="info_wrap">
      <li class="info_hint">
        <h4 class="title">新手任务</h4>
        <p class="hint red"><img class="arrow" src="@/assets/auth/info.png" alt="">提示：请根据指引完成新手任务后，您就能获取店铺经营权！</p>
      </li>
      <li class="info_item">
        <h4 class="title">完善店铺资料</h4>
        <div>
          <div class="info mb_10"><span class="c_999">说明：</span>完善店铺资料，让雇主更加相信您。</div>
          <div class="info"><span class="c_999">进度：</span><span
            class="red">{{storeInfo.isStore === 0 ?'未完成':'已完成'}}</span></div>
        </div>
        <span class="red_btn btn" type="primary" size="small" @click="jumpPage(1)">立即完善</span>
      </li>
      <li class="info_item">
        <h4 class="title">完善擅长技能</h4>
        <div>
          <span class="red_btn btn" type="primary" size="small" @click="jumpPage(2)">立即完善</span>
          <div class="info mb_10"><span class="c_999">说明：</span>完善擅长技能，让雇主更快匹配您。</div>
          <div class="info"><span class="c_999">进度：</span><span class="red">{{storeInfo.isEntered?'已完成':'未完成'}}</span>
          </div>
        </div>
      </li>
      <li class="info_item">
        <h4 class="title">完善实名认证</h4>
        <div>
          <span class="red_btn btn" type="primary" size="small" @click="jumpPage(3)">立即申请</span>
          <div class="info mb_10"><span class="c_999">说明：</span>完善实名认证，让雇主更放心。</div>
          <div class="info"><span class="c_999">进度：</span><span class="red">{{storeInfo.isAuth?'已完成':'未完成'}}</span>
          </div>
        </div>
      </li>
      <li class="info_item">
        <h4 class="title">缴纳保证金</h4>
        <div>
          <span class="red_btn btn" type="primary" size="small" @click="jumpPage(4)">立即缴纳</span>
          <div class="info mb_10"><span class="c_999">说明：</span>缴纳保证金，让雇主更安心。</div>
          <div class="info"><span class="c_999">进度：</span><span class="red">{{storeInfo.isPayMargin?'已完成':'未完成'}}</span>
          </div>
        </div>
      </li>
    </ul>
    <skyPop v-model="applyFlag" @change="emitClose">
      <template>
        <h5 class="pop-title">温馨提示</h5>
        <p class="pop-top mb_48">您的店铺开通申请已提交，管理员会在72小时内完成审核，请耐心等待。</p>
      </template>
    </skyPop>
  </div>
</template>

<script>
  import skyPop from '@/components/service/order/skyPop'
  import {getShopInfo} from '@/api/storeInfo'
  import {applyOpen} from '@/api/auth'
  import {homeImage} from "@/api/list";
  import {mapMutations, mapState} from 'vuex'

  export default {
    name: "newbieTask",
    components: {skyPop},
    data() {
      return {
        storeInfo: {},
        original: {},
        applyFlag: false,//false
        leftImg: '',
        rightImg: '',
      }
    },
    created() {
      this.getShopInfoHttp();
      this.getImage(22);
      this.getImage(23);
    },
    methods: {
      emitClose() {
        this.applyFlag = false;
      },
      routerJump(index) {
        this.$router.push({
          path: index === 0 ? "/settleIntroduce" : "/userContent/homePage/novicClick"
        });
      },
      openStore() {
        this.getApplyOpen();
      },
      jumpPage(type) {
        if (type == 1) {
          this.$router.push({path: '/storeInfoPerson'})
          return;
        }
        let storeInfo = this.storeInfo;
        if (storeInfo.isStore === 0) {
          this.$toast('请先完善店铺资料')
          return;
        }
        if (type == 2) { //isEntered
          this.$router.push('/skillManage')
        } else if (storeInfo.isEntered) {
          if (type == 3) {//isAuth
            if (storeInfo.isStore === 0) {
              this.$router.push('/authType')
            } else {
              this.$router.push({path: storeInfo.type_id === 1 ? '/personalInfo' : '/companyInfo'})
            }
          } else if (type == 4) {//isPayMargin
            this.$router.push({path: '/deposit'})
          }
        } else {
          this.$toast('请先完善擅长技能')
        }
      },
      async getShopInfoHttp() {
        const data = await getShopInfo();
        if (!data) return
        this.storeInfo = data;
        localStorage.setItem('storeInfo', JSON.stringify(data));
      },
      async getApplyOpen() {
        const data = await applyOpen();
        if (!data) return
        this.applyFlag = true;
        this.getShopInfoHttp();
      },
      async getImage(type) { // 22 23
        const data = await homeImage(type);
        if (!data) return
        if (type === 22) {
          this.rightImg = data;
        } else {
          this.leftImg = data;
        }
      },
    },
    computed: {
      ...mapState(['userInfo']),
    },
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .store_status {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 140px;
    padding: $w_30;
    color: $c_333;
    background: $white;

    .logo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin: $w_10 $w_20 $w_10 0;
    }

    .store_wrap {

    }

    .name {
      height: 40px;
      line-height: 40px;
      font-size: 28px;
      font-weight: bold;
    }

    .level {
      display: flex;
      align-items: center;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      font-size: 22px;

      span {
        display: inline-block;
        height: 28px;
        line-height: 28px;
        font-size: 22px;
        font-weight: 500;
      }

      .arrow {
        width: 12px;
        height: 22px;
        margin-left: $w_10;
      }

      .mr_70 {
        margin-right: 70px;
      }
    }
  }

  .error_info {
    display: flex;
    align-items: center;
    height: 50px;
    text-indent: 15px;
    font-size: 22px;
    color: $c_333;
    background: $white;
    margin: 10px 15px 20px;
  }

  .banner_wrap {
    display: flex;
    padding: 0 $w_10;
    margin-bottom: $w_20;

    .banner_item {
      margin: 0 5px;
      width: 355px;
      height: 200px;
    }

    .logo {
      width: 355px;
      height: 200px;
    }
  }

  .info_wrap {
    padding: 0 $w_15;
    font-weight: 400;
    color: $c_333;
    background: $c_bg;

    .info_hint, .info_item {
      padding: $w_20;
      background: $white;
      margin-bottom: $w_20;
      position: relative;

      .arrow {
        width: 30px;
        height: 22px;
        margin-right: $w_10;
      }

      .title {
        height: 40px;
        line-height: 40px;
        font-size: 28px;
        margin-bottom: $w_20;
      }

      .hint, .info {
        line-height: 30px;
        font-size: 22px;
      }

      .red_btn {
        width: 130px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        font-size: 24px;
        color: $red;
        background: $white;
        border-radius: 4px;
        border: 1px solid $red;
      }

      .btn {
        position: absolute;
        top: 50%;
        right: 30px;
        transform: translateY(-50%);
        z-index: 10;
      }
    }
  }
</style>
