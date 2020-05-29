<template>
  <div>
    <qrcode-vue id="qCanvas" :value="shareUrl" :size="120" style="display: flex;justify-content: center;"></qrcode-vue>
    <canvas id="shareCanvas" width="640" height="860"></canvas>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import qrcode from "@/assets/invitation/qrcode.png";
export default {
  name: "invitationCpn",
  components: {
    QrcodeVue
  },
  props: ["url"],
  data() {
    return {
      shareUrl: this.url,
      posterImg: "",
      userInfo: "",
    };
  },
  mounted() {
    // console.time();
    var vm = this;
    // 获取二维码
    var qCanvas = document.getElementById("qCanvas").children[0];
    var ctxq = qCanvas.getContext('2d');

    // 画分享图
    var shareCanvas = document.getElementById('shareCanvas');
    var ctx = shareCanvas.getContext('2d');

    // 画背景图
    var imgObj = new Image();
    imgObj.src = qrcode;
    imgObj.onload = function() {
      ctx.drawImage(this, 0, 0,640,860);
      
      // 画二维码
      var imgObj2 = new Image();
      imgObj2.src = qCanvas.toDataURL("image/png");
      imgObj2.onload = function() {
        ctx.drawImage(this, 230, 470, 168, 168);
        vm.$emit("qrcode", shareCanvas.toDataURL("image/png"));
        // console.timeEnd();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
