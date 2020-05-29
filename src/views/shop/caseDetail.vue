<template>
  <div class="container bg" v-if="detail!=''">
    <shop-Head type="case"></shop-Head>
    <!--    '?x-oss-process=image/resize,m_fill,h_120,w_750'-->
    <van-image v-if="detail.image_url" class="detail_img" :src="detail.image_url" :noOss="false" :lazy-load="true"/>
    <div class="case_head">
      <h4 class="case_name">{{detail.case_name}}</h4>
      <ul class="case_content">
        <li class="item"><span class="label">合作费用</span><em class="price">￥{{detail.price}}</em></li>
        <li><span class="label">客户领域</span><em class="name">{{detail.sr_name}}</em></li>
        <li><span class="label">客户名称</span><em class="name">{{detail.customer_name}}</em></li>
        <li><span class="label">示例分类</span><em class="name">{{detail.cate_name}}</em></li>
      </ul>
    </div>
    <div class="case_wrap">
      <h4 class="title">示例详情</h4>
      <p class="desc" v-html="detail.desc"></p>
    </div>
    <!--回到顶部-->
    <up-back></up-back>
  </div>
</template>

<script>
  import {getCaseInfo} from '@/api/shopList'
  import ShopHead from "./components/shopHead";
  import UpBack from "@/components/service/upBack";

  export default {
    name: "caseDetail",
    components: {UpBack, ShopHead},
    data() {
      return {
        selectId: 0,
        detail: ''
      }
    },
    created() {
      let {id = 0} = this.$route.query;
      this.selectId = id;
      this.getCase();
    },
    methods: {
      async getCase() {
        let data = await getCaseInfo(this.selectId);
        if (!data) return   this.$router.push({
          path: "/closeData",
           query: { type: 7 }
        });
        this.detail = data;
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    .detail_img {
      display: block;
      width: 100%;
    }
  }

  .case_head {
    background: $white;
    padding: $w_30 $w_30 $w_10;

    .case_name {
      font-size: 26px;
      font-weight: 500;
      line-height: 37px;
      @include ellipsis(2)
    }

    .case_content {
      padding-top: $w_10;

      & > li {
        margin: $w_20 0;
        line-height: 37px;
      }

      .item {
        line-height: 42px;
      }

      .label {
        color: $c_999;
        font-size: 22px;
        margin-right: $w_30;
      }

      .name {
        font-size: 26px;
      }

      .price {
        font-size: 30px;
        color: $price;
      }
    }

  }

  .case_wrap {
    margin-top: $w_20;
    background: $white;
    padding: $w_30;

    .title {
      @include height(42px);
      font-size: 30px;
    }

    .desc {
      font-size: 24px;
      line-height: 33px;
      margin: $w_20 0;

      img {
        width: 100%;
      }
    }
  }

</style>
<style lang="scss">
  .case_wrap {
    .wscnph {
      display: block;
      max-width: 100%;
    }

    img {
      width: 100%;
    }
  }

</style>
