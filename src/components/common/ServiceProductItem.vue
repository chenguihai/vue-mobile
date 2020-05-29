<template>
  <li class="m-product-item">
    <img src="@/assets/userContent/zhuangixiang.png" alt />
    <span>服务名称服务名称服务名称服务服务名称服务名称服务名称</span>
    <div class="money">
      <span>￥1000/月</span>
      <span v-if="buyNumShow == 1">
            成交量：
            <p>9999</p>
          </span>
      <a v-if="theSameShow == 1" class="m-same">
        看相似
      </a>
    </div>
  </li>
</template>
<script>
  export default {
    name: 'serviceProductItem',
    props: ['productInfo','buyNumShow','theSameShow'],
    data () {
      return {

      }
    }
  }
</script>
<style lang="scss" scoped>
  li.m-product-item {
    display: flex;
    flex-direction: column;
    width: rem(334);
    &>img {
      width: rem(334);
      height: rem(200);
    }
    &>span {
      width: rem(334);
      font-size: rem(24);
      color: #333;
      margin: rem(17) 0 rem(20) 0;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &>.money {
      display: flex;
      justify-content: space-between;
      font-size: rem(24);
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
        line-height:rem(60);
        &>p {
          color: #0066CC;
        }
      }
    }
  }
</style>
