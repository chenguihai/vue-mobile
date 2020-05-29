<template>
  <div class="oreder_item" :key="order.id">
    <div class="head">
      <span>申请时间：{{order.created_at}}</span>
      <span class="status">{{order.status}}</span>
    </div>
    <div :class="['middle',{'active':order.status === '待处理'}]" @click="jumpToDetail(order.id)">
      <p class="name_wrap"><span class="name">{{order.name}}</span> <span
        class="price">￥<span>{{order.amount}}</span></span>
      </p>
      <p class="desc">雇主昵称：<span>{{order.nickname}}</span></p>
      <p class="desc" v-if="order.apply_reason">退款原因：<span>{{order.apply_reason}}</span></p>
<!--      <p class="desc" v-if="order.refuse_reason">拒绝原因：<span>{{order.refuse_reason}}</span></p>-->
    </div>
    <div class="btn_wrap" v-if="order.status === '待处理'">
      <van-button plain class="btn" @click="agreeRefund(order.id)">同意退款</van-button>
      <van-button plain class="btn active" @click="refusalRefund(order.id)">拒绝退款</van-button>
    </div>
  </div>
</template>

<script>

    export default {
        name: "orderItem",
        props: {
            item: {
                type: Object,
                reqirue: true
            },
            index: {
                type: Number,
                reqirue: true
            }
        },
        data() {
            return {
                // selectId: 0,
                order: this.item,
                selectIndex: this.index
            }
        },
        methods: {
            jumpToDetail(id) {
                this.$router.push({path: '/order/orderDetail', query: {id: this.order.id}})
            },
            onSubmit() {
                this.$emit('submit')
            },
            agreeRefund(id) {
                this.$emit('open', id,this.selectIndex)
            },
            refusalRefund(id) {
                this.$router.push({path: '/refusalRefund', query: {id: id, type: 'list'}})
            }
        }
    }
</script>

<style scoped lang="scss">
  .oreder_item {
    background-color: $white;
    padding: 0 $w_30;
    font-size: 24px;
    margin: $w_20 0;

    .head {
      height: 73px;
      line-height: 73px;
      color: $c_999;

      .status {
        float: right;
        color: $orange;
        font-size: 22px;
      }
    }

    .middle {
      padding: $w_20 0;
      border-top: 1px solid $c_eee;

      &.active {
        border-bottom: 1px solid $c_eee;
      }

      .name_wrap {
        display: flex;

        .name {
          flex: 1;
          line-height: 33px;
          @include ellipsis(2);
        }
      }

      .desc {
        color: $c_666;
        margin-top: $w_10;
      }

      .price {
        text-align: right;
        color: $price;
        width: 200px;
        font-size: 30px;
        font-weight: 500;
        @include height(42px);
      }
    }
  }

  .btn_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 90px;

    .btn {
      margin-left: $w_20;
      width: 135px;
      height: 50px;
      font-size: 24px;
      border-radius: 25px;
      text-align: center;
      line-height: 50px;
      color: $c_666;
      background: $white;
      border: 1px solid $c_ccc;
    }

    .active {
      color: $red;
      background: $white;
      border: 1px solid $red;
    }
  }

</style>
