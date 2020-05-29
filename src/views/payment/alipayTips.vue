<template>
  <div class="m-tips-wrap">
    <head-nav title="支付成功"></head-nav>
    <div class="content">
      <img src="../../../static/images/payment/icon-success.png" alt="" />
      <h3>恭喜您 <br>本次交易支付成功</h3>
      <p>订单号:{{orderId}}</p>
      <div class="m-back"><a href="/">返回首页</a></div>
    </div>
  </div>
</template>
<script>
import HeadNav from '@/components/common/HeadNav'
export default {
  name: 'applyText',
  data () {
    return {
      apply: '',
      showMenu: false,
      orderId: 0
    }
  },
  components: {
    HeadNav
  },
  mounted () {
    let orderId = this.$route.query.out_trade_no
    this.orderId = orderId
  }
}
</script>
<style scoped lang="scss">
  .m-back{
    position: absolute;
    width:100%;
    left:0;
    font-size:28px;
    bottom:150px;
    a{
      color:#0066cc;
    }
  }
  .m-tips-wrap{
    height:100vh;
    background:#fff;
  }
  .content{
    padding-top:136px;
    text-align: center;
    font-size:24px;
    width:100%;
    color:#666;
    img{
      width:263px;
      height:246px;
    }
    h3{
      color:#333;
      font-size:32px;
      line-height:1.5em;
      padding-top:40px;
      font-weight: bold;
    }
    p{
      color:#999;
      font-size:24px;
      line-height:2.5em;
    }
  }
</style>
