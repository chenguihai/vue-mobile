<template>
  <div class="plate_wrap">
    <div class="des"><span class="title">平台声明： </span>凌天众媒网为第三方交易平台及互联网信息服务居间提供者，凌天众媒网（含PC、H5网站等）所展示的商品/服务的标题、价格、详情、图片、视频等信息内容系由店铺经营者发布，其真实性、准确性和合法性均由店铺经营者负责。凌天众媒网提醒用户购买商品/服务前注意谨慎核实。如用户或权利人对商品/服务的标题、价格、详情图片、视频等任何信息有任何疑问的，请在购买前与店铺经营者沟通确认；如用户发现店铺内有任何违法/侵权信息，请立即向凌天众媒网举报并提供有效线索，我们在核实后将及时删除违法/侵权信息。
    </div>
  </div>
</template>

<script>
  export default {
    name: "platformState",
    data(){
      return {

      }
    }
  }
</script>

<style scoped lang="scss">
  .plate_wrap {
    /*position: absolute;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*z-index: 10;*/
    padding: 0 30px;

    .title {
      display: block;
      margin-bottom: 10px;
      font-size: 26px;
      color: $c_333;
      height: 37px;
      line-height: 37px;
      color: $c_333;
    }

    .des {
      color: $c_666;
      font-size: 22px;
      line-height: 30px;
    }
  }

</style>
