<template>
  <div class="m-menu-wrap">
    <div class="m-menu-pop" @click="closeThis"></div>
    <div class="m-menu-slide">
      <div class="m-arrow"></div>
      <ul>
        <li>
          <img class="m-icon" src="../../../static/images/icon-menu-slide-home.png" alt="">
          <a href="/">首页</a>
        </li>
        <li>
          <img class="m-icon" src="../../../static/images/icon-menu-slide-cagegory.png" alt="">
          <a href="/serviceClaList">分类</a>
        </li>
        <li>
          <img class="m-icon" src="../../../static/images/icon-menu-slide-cart.png" alt="">
          <a href="/">购物车</a>
        </li>
        <li>
          <img class="m-icon" src="../../../static/images/icon-menu-slide-my.png" alt="">
          <a href="/userContent/homePage/homePage">我的</a>
        </li>
      </ul>
    </div>
  </div>

</template>
<script>
export default {
  name: 'MenuSlide',
  props: [],
  data () {
    return {

    }
  },
  methods: {
    closeThis () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .m-menu-wrap{
    position: fixed;
    left:0;
    top:0;
    bottom:0;
    right:0;
    z-index: 100000;
  }
  .m-menu-pop{
    position: absolute;
    z-index: 10;
    left:0;
    top:0;
    right:0;
    bottom:0;
  }
  .m-menu-slide{
    position: absolute;
    z-index: 1000;
    right:rem(20);
    top:rem(90);
    width:rem(226);
    height:rem(321);
    background:#000;
    opacity: 0.8;
    color:#fff;
    -webkit-border-radius: rem(10);
    -moz-border-radius: rem(10);
    border-radius: rem(10);
    li{
      height:rem(77);
      line-height:rem(77);
      position: relative;
      padding-left:rem(76);
      .m-icon{
        position: absolute;
        width:rem(26);
        height:rem(26);
        left:rem(25);
        top:50%;
        margin-top:rem(-13);
      }
      a{
        display: block;
        height:rem(77);
        color:#fff;
        font-size:rem(26);
        border-bottom:1px solid #fff;
      }
    }
    li:last-child a{
      border:0;
    }
    .m-arrow{
      background:#000;
      position: absolute;
      right:rem(15);
      top:rem(-10);
      width:rem(30);
      height:rem(30);
      transform: rotate(45deg);
    }
  }
</style>
