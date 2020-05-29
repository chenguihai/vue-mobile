<template>
  <div class="err_main">
    <div class="error_img">
      <img src="/static/images/404.png" />
      <div class="err_text">
        <p>哎呀...您访问的页面不存在</p>
        <p>{{num}}s后跳到首页</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 3,
      times: null
    };
  },
  mounted() {
    this.times = setInterval(() => {
      if (this.num > 0) {
        this.num -= 1;
      } else {
          this.$router.push("/")
        clearInterval(this.times);
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.times);
  }
};
</script>
<style lang="scss" scoped>
.err_main {
  width: 100%;
  height: 100%;
  position: relative;
  color: rgba(153, 153, 153, 1);
  .error_img {
    width: rem(480);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
    .err_text {
      transform: translate(0, rem(-110));
      p {
        font-size: rem(36);
        font-family: Alibaba PuHuiTi;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: rem(28px);
        margin-bottom: rem(50);
      }
      p + p {
        font-size: 28px;
      }
    }
  }
}
</style>