<template>
  <div class="container bg">
    <!--    <head-nav title="实名认证"></head-nav>-->
    <p class="type_desc">仅针对中国大陆用户（开店铺认证）</p>
    <ul class="type_wrap">
      <li class="type_item pr" v-if="this.type ==='personal'">
        <h3 class="title">个人实名</h3>
        <p class="desc">每个身份证仅支持5个账户使用， 且认证通过身份证号不能修改</p>
<!--        :to="{path:'/personalInfo'}"-->
        <van-button @click="$emit('jump')" round plain class="type_btn yellow_btn">立即认证</van-button>
        <img class="img user_img" src="@/assets/auth/user.png" alt="">
      </li>
      <li class="type_item pr" v-else>
        <h3 class="title">企业实名</h3>
        <p class="desc">每个身份证仅支持5个账户使用， 且认证通过身份证号不能修改</p>
<!--        :to="{path:'/companyInfo'}"-->
        <van-button @click="$emit('jump')" plain class="type_btn blue_btn">立即认证</van-button>
        <img class="img company_img" src="@/assets/auth/company.png" alt="">
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "authType",
        props: ['type'],
        data() {
            return {}
        }
    }
</script>


<style scoped lang="scss">
  .container {
    padding: $w_30;
  }

  .type_desc {
    @include height();
    font-size: 26px;
    color: $c_666;
    margin-bottom: 24px;
    text-align: center;
  }

  .type_wrap {
    .type_item {
      height: 354px;
      padding: 50px;
      box-shadow: 0px 4px $w_20 0px rgba(0, 0, 0, 0.1);
      border-radius: $w_20;
      background: $white;
      margin-bottom: $w_30;
    }

    .img {
      @include rightBottom();
    }

    .user_img {
      width: 200px;
      height: 240px;
    }

    .company_img {
      width: 205px;
      height: 242px;
    }

    .title {
      @include height(50px);
      font-size: 36px;
      font-weight: 500;
    }

    .desc {
      width: 351px;
      height: 66px;
      font-size: 24px;
      color: $c_999;
      line-height: 33px;
      margin: $w_30 0 50px;
    }

    .type_btn {
      width: 200px;
      @include height(58px);
      border-radius: 4px;
    }

    .yellow_btn {
      background: linear-gradient(180deg, #FE8B11 0%, #FF6C01 100%);
    }

    .blue_btn {
      background: linear-gradient(180deg, #6191FF 0%, #305FFF 100%);
    }
  }
</style>
