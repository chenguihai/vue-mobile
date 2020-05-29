<template>
  <div class="service_item">
    <a tag="div" :href="'/shopDetail/'+item.id" class="shop_info clearFix">
      <van-image v-if="!!item.logo" fit="cover" class="logo" :src="item.logo" :noOss="false"
                 :lazy-load="true"></van-image>
      <img v-else class="logo" src="@/assets/default/shop.png" alt/>
      <h4 class="name">{{item.store_name}}</h4>
      <lvInfo :oblig="item" type="bond"></lvInfo>
      <address class="addr"><span class="addr_icon"></span><span>{{item.cityShortName}}</span></address>
      <p class="info"><span>90天成交量<em>{{item.sales}}</em></span><span
        class="rate">好评率 <em>{{item.praise_rate || 0}}%</em></span></p>
    </a>
    <div class="skill">
      <div class="skill_text">擅长技能：<span :class="{skill_item:index !== 0}" v-for="(sub,index) in item.skillList"
                                         :key="sub.cat_one">{{sub.cate_name}}</span>
      </div>
      <!--相关服务-->
      <template v-if="item.service_list.length > 0">
        <h3 class="title"><span class="text">相关服务</span></h3>
        <ul class="service_list">
          <a tag="li" :href="`/serviceDetail/${subItem.id}?id=${subItem.store_id}`"
                       class="item" v-for="(subItem,subIndex) in item.service_list" :key="subIndex">
            <van-image fit="cover" class="img" :src="subItem.img" :noOss="false" :lazy-load="true"></van-image>
            <p class="name">{{subItem.name}}</p>
            <span class="price">￥{{subItem.price}}/{{subItem.unit_name}}</span>
          </a>
        </ul>
      </template>
    </div>
  </div>
</template>
<script>
  import lvInfo from '@/components/service/lvInfo'

  export default {
    name: "serviceItem",
    components: {lvInfo},
    props: {
      item: {
        type: Object,
        reqirue: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .service_item {
    background: $white;
    font-size: 24px;
    color: $c_333;
    margin-top: $w_20;
    padding: 0 $w_30 $w_30;

    .shop_info {
      color: $c_666;
      padding: $w_20 0;

      .logo {
        float: left;
        width: 180px;
        height: 180px;
        margin-right: $w_20;
      }

      .name {
        color: $c_333;
      }

      .addr {
        display: flex;
        align-items: center;
        height: 28px;
        font-size: 20px;
        margin: 16px 0;
        color: $c_666;

        .addr_icon {
          width: 20px;
          height: 26px;
          background: url("/static/images/address_red.png") no-repeat center;
          background-size: 20px 26px;
          margin-right: 10px;
        }
      }

      .info {
        height: 33px;
        line-height: 33px;

        em {
          color: $red;
        }

        .rate {
          margin-left: 66px;
        }
      }
    }

    .skill {
      .skill_text {
        @include ellipsis(2);
        height: 60px;
        overflow: hidden;
        line-height: 30px;
      }

      .skill_item {
        display: inline-block;
        border-left: 1px solid $c_ccc;
        margin-left: $w_20;
        margin-bottom: 5px;
        padding-left: $w_20;
      }

      padding-bottom: $w_20;
      border-bottom: 1px solid $c_eee;
    }

    .title {
      height: 30px;
      font-size: 22px;
      line-height: 30px;
      margin: $w_20 0 24px;

      .text {
        display: inline-block;
        position: relative;

        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          height: 4px;
          width: 100%;
          background: $red;

        }
      }
    }

    .service_list {
      display: flex;
      /*justify-content: space-between;*/

      .item {
        width: 210px;

        &:not(:last-child) {
          margin-right: $w_30;
        }

      }

      .img {
        width: 210px;
        height: 126px;
        background: $d8d8d8;
      }

      .name {
        height: 60px;
        font-size: 22px;
        color: $c_333;
        line-height: 30px;
        margin: $w_10 0;
        @include ellipsis(2);
      }

      .price {
        color: $price;
        height: 33px;
        line-height: 33px;
        font-size: 24px;
        font-weight: 500;
      }
    }
  }
</style>
