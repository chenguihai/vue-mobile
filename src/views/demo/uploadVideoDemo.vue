<template>
  <div>
    <div class="poster_box" id="posterHtml">
      <div class="post_relative">
        <img class="post_img" src="@/assets/invitation/poster_banner.png" alt="海报banner" />
        <div class="qrcode-wrapper" style="margin:40px auto 20px">
          <qrcode-vue :value="shareUrl" :size="150" style="display: flex;justify-content: center;"></qrcode-vue>
        </div>
        <p class="post_text">扫码注册入驻 开启赚钱之旅</p>
        <img class="post_logo" src="@/assets/invitation/poster_logo.png" alt="公司logo" />
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
// import html2canvas from "html2canvas";

export default {
  name: "uploadVideoDemo",
  components: {
    QrcodeVue
  },
  data() {
    return {
      shareUrl: location.href,
      posterImg: ""
    };
  },
  methods: {
    createPoster() {
      // 生成海报
      // window.pageYOffset = 0;
      // document.documentElement.scrollTop = 0;
      // document.body.scrollTop = 0;
      // const vm = this;
      // const domObj = document.getElementById("posterHtml");
      // html2canvas(domObj, {
      //   useCORS: true,
      //   allowTaint: false,
      //   logging: false,
      //   letterRendering: true,
      //   onclone(doc) {
      //     let e = doc.querySelector("#posterHtml");
      //     e.style.display = "block";
      //   }
      // }).then(function(canvas) {
      //   // 在微信里,可长按保存或转发
      //   console.log('canvas=======',canvas)
      //   vm.posterImg = canvas.toDataURL("image/png");
      //   vm.$emit("qrcode", vm.posterImg);
      // });
    }
  },
  mounted() {
    //将img插入容器
    // this.$nextTick(() => {
    //   let timer = setTimeout(() => {
    //     this.createPoster();
    //     clearTimeout(timer);
    //   }, 500);
    // });
  }
};
</script>
<style lang="scss" scoped>
.poster_box {
  width: 640px;
  height: auto;
  margin: 0 auto;
  position: fixed;
  z-index: -1;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 30px;
  // overflow: hidden;
  .post_relative {
    position: relative;
    padding-bottom: 42px;
  }
  .post_img {
    display: block;
    width: 100%;
  }
  .post_text {
    line-height: 24px;
    font-size: 24px;
    color: #666;
    text-align: center;
  }
  .post_logo {
    display: block;
    margin: 58px auto 0;
    width: 183px;
    height: 67px;
  }
}

</style>
