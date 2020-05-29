<template>
  <div class="audit">
    <img class="img" src="@/assets/auth/audit.png" alt="待审核">
    <h4 class="title">您的实名认证申请已提交！</h4>
    <p class="desc">管理员会在72小时内完成审核，请耐心等待。</p>
    <div>
      <van-button plain class="danger_btn mr_30" :to="{path:'/newbieTask'}">返回新手任务</van-button>
      <van-button plain class="plain_btn" :to="{path:'/deposit'}">前往缴纳保证金</van-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "auditWait"
    }
</script>
<style scoped lang="scss">
  .audit {
    padding: 87px 60px;
    text-align: center;

    .img {
      display: block;
      width: 180px;
      height: 246px;
      margin: 0 auto 87px;
    }

    .title {
      @include height(42px);
      font-size: 30px;
      font-weight: 500;
    }

    .desc {
      @include height();
      font-size: 26px;
      margin: $w_30 0 57px;
    }

    .danger_btn {
      @include danger_btn();
    }

    .plain_btn {
      @include plain_btn();
    }
  }
</style>
