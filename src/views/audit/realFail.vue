<template>
  <div class="audit_failed">
    <img class="img" src="@/assets/no_data.png" alt="待审核">
    <h4 class="title">您的实名认证失败！</h4>
    <p class="desc">失败原因：{{authInfo.remarks}}</p>
    <van-button plain class="danger_btn" @click="$emit('step',1)">重新申请</van-button>
  </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "realFail",
        computed: mapState({
            authInfo: state => state.authInfo
        })
    }
</script>

<style scoped lang="scss">
  .audit_failed {
    text-align: center;
    padding: 60px;

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

