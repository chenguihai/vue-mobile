<template>
  <div class="m-bottom-slide-wrap">
    <div class="m-bottom-slide-pop" @click="closeThis"></div>
    <div class="m-bottom-slide-slide">
      <div class="m-arrow"></div>
      <ul>
        <li v-if="flagS ==1">
          <a href="javascript:void(0)" @click="replenishClues">线索补充</a>
        </li>
        <li>
          <a href="javascript:void(0)" @click="closeCluesTips">关闭线索</a>
        </li>
      </ul>
    </div>
  </div>

</template>
<script>
import {Dialog} from 'vant'
export default {
  name: 'MenuSlide',
  props: ['flagS'],
  data () {
    return {

    }
  },
  components: {

  },
  methods: {
    closeThis () {
      this.$emit('close')
    },
    replenishClues () {
      this.$emit('replenishClues')
      this.closeThis()
    },
    closeCluesTips () {
      Dialog.confirm({
        title: '关闭线索',
        message: '如要关闭线索，请联系<a style="color:#0066cc" href="https://url.cn/59IhwSe?_type=wpa&qidian=true" target="_blank">官方客服</a>'
      }).then(() => {
        // on confirm
      }).catch(() => {
        // on cancel
      })
      this.closeThis()
    }
  }
}
</script>
<style lang="scss" scoped>
  .m-bottom-slide-wrap{
    position: fixed;
    left:0;
    top:0;
    bottom:0;
    right:0;
    z-index: 100000;
  }
  .m-bottom-slide-pop{
    position: absolute;
    z-index: 2000;
    left:0;
    top:0;
    right:0;
    bottom:0;
  }
  .m-bottom-slide-slide{
    position: absolute;
    z-index: 3000;
    left:rem(25);
    bottom:rem(128);
    width:rem(213);
    max-height:rem(170);
    background:#000;
    opacity: 0.8;
    color:#fff;
    -webkit-border-radius: rem(10);
    -moz-border-radius: rem(10);
    border-radius: rem(10);
    li{
      height:rem(85);
      line-height:rem(85);
      position: relative;
      a{
        display: block;
        height:rem(85);
        color:#fff;
        text-align: center;
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
      left:rem(15);
      bottom:rem(-10);
      width:rem(30);
      height:rem(30);
      transform: rotate(45deg);
    }
  }
</style>
