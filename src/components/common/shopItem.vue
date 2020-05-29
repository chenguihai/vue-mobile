<template>
  <div>
    <a tag="div" :href="`/serviceDetail/${item.id}?id=${item.store_id}`" class="item">
      <van-image fit="cover" class="img" :src="item.img+'?x-oss-process=image/resize,m_fill,h_217,w_346'" :noOss="false" :lazy-load="true"></van-image>
      <p class="name">{{item.name}}</p>
      <div class="num_wrap">
        <span class="price">￥{{item.price}}/{{item.unit_name}}</span>
        <span class="num">成交量<em>{{item.deal_num}}</em></span>
      </div>
    </a>
  </div>
</template>

<script>
  export default {
    name: "shopItem",
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
  }
</script>

<style scoped lang="scss">
  .item {
    flex: 1;
    padding: $w_10 $w_10 $w_20;
    border: 1px solid $c_eee;
    margin-bottom: $w_10;
    display: block;
    .img {
      /*width: 100%;*/
      width: 100%;//320px;
      height: 192px;
      background: $d8d8d8;
    }

    .name {
      height: 60px;
      font-size: 22px;
      color: $c_333;
      line-height: 30px;
      margin: $w_10 0 6px;
      @include ellipsis(2);
    }

    .num_wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 33px;
      font-size: 24px;
      font-weight: 500;
      color: $c_999;

      em {
        margin-left: 10px;
        color: $blue;
      }
    }

    .price {
      color: $price;
    }

    .num {
      font-size: 20px;
    }
  }
</style>
