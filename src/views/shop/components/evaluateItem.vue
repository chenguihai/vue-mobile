<template>
  <div class="evaluate_item">
    <ul class="head">
      <li class="head_item">
        <van-image v-if="comment.avatar" round class="img" :src="comment.avatar+'?x-oss-process=image/resize,m_fill,h_60,w_60'" :noOss="false"></van-image>
        <img v-else class="img" src="@/assets/default/user.jpg" alt="默认头像"/>
        <span class="name">{{comment.nick_name}}</span>
      </li>
      <commentIcon :type="+comment.evaluate" :value="+comment.avgScore"></commentIcon>
      <li class="head_item"><span>{{comment.u_time.split(' ')[0]}}</span></li>
    </ul>
    <div class="service"><span class="name">{{comment.name}}</span>
      <span>成交金额</span><span class="price">￥{{comment.amount}}</span></div>
    <p class="desc">
      {{comment.u_content}}
    </p>
    <p class="desc desc_text" v-if="comment.explain">服务商解释：{{comment.explain}}</p>
  </div>
</template>

<script>
  import commentIcon from '@/components/service/detail/commentIcon'

  export default {
    name: 'evaluateItem',
    props: ['comment'],
    components: {commentIcon}
  }
</script>

<style scoped lang="scss">
  .evaluate_item {
    border-top: 1px solid $c_eee;
    padding: $w_20 0 $w_30;

    .head {
      display: flex;
      justify-content: space-between;
      font-size: 20px;

      .head_item {
        display: inline-flex;
        align-items: center;
        color: $c_999;
        height: 60px;
        white-space: nowrap;

        // &:nth-of-type(2) {
        //  margin: 0 $w_30;
        // }

        .name {
          color: $c_666;
          @include ellipsis();
        }

        .red {
          color: $red;
          margin: 0 $w_10;
        }
      }

      .img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: $w_10;
      }

      .icon {
        width: 36px;
        height: 36px;
      }
    }

    .service {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 33px;
      font-size: 24px;
      color: $c_666;
      margin: $w_20 0 $w_10;

      .name {
        flex: 1;
        line-height: 24px;
        color: $blue;
        @include ellipsis();
      }

      .price {
        color: $price;
      }
    }

    .desc {
      font-size: 20px;
      line-height: 28px;
      word-break: break-all;

      &:first-of-type {
        margin-bottom: 12px;
      }
    }

    .desc_text {
      color: $orange;
    }
  }
</style>
