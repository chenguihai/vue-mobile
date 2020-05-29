<template>
      <li class="m-product-item">
        <a class="item-content" :href="`/serviceDetail/${productInfo.id}?id=${productInfo.store_id}`">
<!--          <img v-lazy="$store.state.ali_api_host + productInfo.thumb" alt />-->
          <van-image fit="cover" :src="productInfo.thumb+'?x-oss-process=image/resize,m_fill,h_217,w_346'" :noOss="false" :lazy-load="true"></van-image>
          <span class="van-multi-ellipsis--l2">{{productInfo.name}}</span>
          <div class="money">
            <span>￥{{productInfo.price}}/{{productInfo.unit_name}}</span>
            <span v-if="buyNumShow == 1">
            成交量：
            <p>9999</p>
          </span>
            <a v-if="theSameShow == 1" class="m-same">
              看相似
            </a>
          </div>
        </a>
      </li>
</template>
<script>
export default {
  name: 'ProductItem',
  props: ['productInfo','buyNumShow','theSameShow'],
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
  li.m-product-item {
        padding:rem(5);
        break-inside: avoid;
        .item-content{
          display: flex;
          flex-direction: column;
          box-shadow:0px 2px 4px 0px rgba(209,209,209,0.5);
          border-radius:rem(8);
          // overflow: hidden;
          .van-image{
            width: 100%;
            height: rem(217);
          }
          &>img {
            width: 100%;
            height: 100%;
            display: block;
          }
          &>span {
            font-size: rem(24);
            color: #333;
            margin: 0.18rem 0 0rem 0;
            text-overflow: ellipsis;
            display: -webkit-box;
            line-height: 0.38rem;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            padding:0 rem(16);
            font-weight: 500;
          }

          &>.money {
            display: flex;
            justify-content: space-between;
            font-size: rem(24);
            padding:0 rem(16);
            &>span:nth-child(1) {
              color: $red;
              line-height:rem(60);
            }
            .m-same{
              border:1px solid #ccc;
              border-radius: rem(30);
              width:rem(124);
              height:rem(60);
              color:#666;
              line-height:rem(60);
              font-size:rem(24);
              background:#fff;
              text-align: center;
            }
            &>span:nth-child(2) {
              color: #999;
              display: flex;
              align-items: flex-end;
              &>p {
                color: #0066CC;
              }
            }
            .m-excharge-num{
              color:#999;
              line-height:rem(60);
              b{
                color:$blue;
              }
            }
          }
        }

  }
</style>
