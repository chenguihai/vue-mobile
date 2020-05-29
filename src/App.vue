<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
    <div class="app-loading-box" v-if="load">
      <van-loading type="spinner" vertical>{{loadTxt}}</van-loading>
    </div>
  </div>
</template>

<script>
import { browser, loginDo, wxLogin } from "@/utils/tool";
import { wechatOpen, wxSharerProxy } from "@/api/account";
// import { encryptedUtil } from "@/utils/util";
import { bin2Hex } from "@/utils/util";

export default {
  name: "App",
  data() {
    return {
      isRouterAlive: true,
      load: false,
      loadTxt: "加载中",

      isIosFlag: "",
      autographCount: 0,
      shareDesc: "凌天众媒网一站式全媒界大型媒体电商平台"
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  // mounted(){
  //   let token = location.search.split('?token=')[1]
  //   if (token) {
  //     loginDo.bind(this)(token)
  //   }
  // },
  watch: {
    // '$route.query.token': {
    //   handler: function (val, oval) {
    //     // this.wxInit(val)
    //   },
    //   immediate: true
    // },
    $route(to, from) {
      // 监听路由是否变化
      if (browser.versions.isWeChat) {
        this.shareImg = location.origin + "/static/share_img.jpg";
         this.autographCount = 0;
        this.wxAutograph();
      }
    }
  },
  methods: {
    async wxAutograph() {
      let shareUrl = sessionStorage.getItem("shareUrl");
      if (!shareUrl) {
        let userInfo = localStorage.getItem("user_info");
        if (userInfo) {
          this.userInfo = JSON.parse(userInfo) || "";
          let {
            original: { id }
          } = this.userInfo;
          // let encrypt = encryptedUtil(id + "");
          let encrypt = window.btoa(bin2Hex(id + ""));
          shareUrl = `${location.origin}/settleIntroduce?inviteUserId=${encrypt}`;
          sessionStorage.setItem("shareUrl", shareUrl);
        }
      }
      const session = window.sessionStorage;
      if (!session.getItem("initLink")) {
        session.setItem("initLink", window.location.href);
      }
      // 非ios设备，切换路由时候进行重新签名
      if (window.__wxjs_is_wkwebview !== true) {
        this.isIosFlag = false;
      }
      // ios 设备进入页面则进行js-sdk签名
      if (window.__wxjs_is_wkwebview === true) {
        const routerName = [
          "/serviceDetail",
          "/shopDetail",
          "/clues/detail",
          "/news/detail",
          "/invitation"
        ];
        let flag = routerName.some(
          item => location.pathname.indexOf(item) > -1
        );
        if (flag) {
          this.isIosFlag = false;
        } else {
          this.isIosFlag = true;
        }
      }
      let url = this.isIosFlag
        ? encodeURIComponent(window.sessionStorage.getItem("initLink"))
        : encodeURIComponent(window.location.href);
      // let url = encodeURIComponent(window.location.href);
      let data = await wxSharerProxy(url);
      if (data) {
        let { appId = "", timestamp = "", nonceStr = "", signature = "" } =
          data || {};
        // sessionStorage.setItem('shareData',JSON.stringify(data));
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: timestamp, // 必填，生成签名的时间戳
          nonceStr: nonceStr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名，见附录1
          jsApiList: [
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareQZone"
            // 'updateAppMessageShareData',
            // 'updateTimelineShareData',
            // 微信新版1.4.0暂不支持安卓，故这里要两个接口一起调用下
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        // console.log('shareContent', this.shareImg, document.title, window.location.href)
        // let imgUrl = document.querySelector('img[src^="http"]')
        let descFlag = location.pathname === "/invitation";
        let config = {
          link: descFlag ? shareUrl ||window.location.href : window.location.href,
          imgUrl: this.shareImg, // 分享图标
          title: descFlag
            ? "众媒时代 强势来袭！"
            : document.title || "凌天众媒", // 分享标题
          desc: descFlag
            ? "入驻凌天众媒店铺，开启赚钱之旅 ~ 更多广告位等你来选，先到先得哦！"
            : "凌天众媒网一站式全媒界大型媒体电商平台",
          success: () => {
            // 用户确认分享后执行的回调函数
          },
          cancel: () => {
            // 用户取消分享后执行的回调函数
          }
        };

        wx.ready(() => {
          // 分享给朋友
          wx.onMenuShareAppMessage(config);
          // 分享到朋友圈
          wx.onMenuShareTimeline(config);
          wx.onMenuShareQQ(config);
          wx.onMenuShareQZone(config);
          // wx.updateTimelineShareData(data);
        });
        wx.error(res => {
          if (this.autographCount === 1) {
            return;
          }
          ++this.autographCount;
          session.setItem("initLink", window.location.href);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          this.wxAutograph();
        });
      }
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
    /**
       * @param code
       * @returns {Promise<{}|*|VanToast>}
       async wxInit(code) {
        if (browser.versions.isWeChat && !localStorage.getItem('token')) {
          if (!code && !sessionStorage.getItem('wxuser')) {
            sessionStorage.setItem('wxuser', 1)
            wxLogin('snsapi_base')
          } else if (code) {
            // 同意授权后
            // 查询是否绑定
            this.loadTxt = '正在努力对应用户信息...'
            this.load = true
            const data = await wechatOpen(code)
            this.load = false
            if (!data) return this.$toast('查询用户信息失败,请使用其他方式登录')
            const {access_token} = data
            if (access_token) {
              // 已经绑定
              loginDo.call(this, access_token)
              this.$toast('登录成功')
              this.$router.replace('/')
            } else {
              // 没有绑定
              this.$router.replace({path: '/binding', query: {redirect: this.$route.fullPath, ...data}})
            }
          }
        }
      }
       */
  }
};
</script>

<style lang="scss">
body,
ul,
li,
p,
div,
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  padding: 0;
}

ul,
li {
  list-style: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
}

.app-loading-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  @include flex(center);
}
</style>
