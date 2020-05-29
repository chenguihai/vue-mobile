<template>
  <div class="status-btn-box">
    <template v-if="role === 2">
      <!-- 雇主视角 -->
      <van-button type="danger" size="small" class="ac-btn" v-if="finals._code === 1" :to="{path: '/payment',
      query: {
        order_sn: orderInfo.order_sn,
        type: 5
      }
    }">托管赏金</van-button>
      <van-button type="danger" size="small" class="ac-btn" v-if="orderInfo.order_status < 6" :to="{path:'/serviceAdditional', query:{sn:orderInfo.order_sn, id:orderInfo.id}}">补充需求</van-button>
      <van-button v-if="orderInfo.order_status <= 2" type="default" size="small" class="de-btn" :to="{path:'/serviceClose', query:{sn:orderInfo.order_sn}}">关闭需求</van-button>
      <van-button v-if="orderInfo.order_status === 3 && orderInfo.isRefund !== 1" type="default" size="small" class="de-btn" :to="{path:'/serviceRefund', query:{sn:orderInfo.order_sn}}">申请退款</van-button>
      <van-button v-if="[6,7].includes(orderInfo.order_status) && orderInfo.u_invoice_status === 0" type="danger" size="small" class="ac-btn" :to="{path:'/userContent/homePage/orderInvoice', query:{sn:orderInfo.order_sn}}">申请发票</van-button>
    </template>
    <template v-else-if="orderInfo.order_status <= 2 && orderInfo.confirm_status === 0">
      <van-button type="danger" size="small" class="ac-btn" @click="popTip(0)">接受订单</van-button>
      <van-button type="default" size="small" class="de-btn" @click="popTip(1)">放弃订单</van-button>
      <skyPop v-model="showPop">
        <!-- 接受订单 -->
        <template v-if="[0,1].includes(nowPop)">
          <h5 class="pop-title">温馨提示</h5>
          <p class="pop-tip">
            {{nowPop === 0 ? '确认接受订单吗？' : '确认放弃订单嘛'}}
          </p>
          <div class="pop-btn" @click="submit">确定</div>
        </template>
      </skyPop>
    </template>
  </div>
</template>

<script>
import skyPop from '@/components/service/order/skyPop'
import { acceptOrder } from '@/api/service'
export default {
  name: 'statusBtns',
  // role 1 服务商 2雇主
  props: ['role', 'orderInfo', 'finals'],
  components: { skyPop },
  data () {
    return {
      showPop: false, // 弹框提示
      nowPop: 0 // 0接受订单 1放弃订单
    }
  },
  methods: {
    popTip (type) {
      this.nowPop = type
      this.showPop = true
    },
    async submit () {
      const params = {
        order_sn: this.orderInfo.order_sn,
        status: this.nowPop === 0 ? 'Y' : 'N'
      }
      const data = await acceptOrder(params)
      if (!data) return
      this.$toast('操作成功')
      this.$emit('update')
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/css/sky-pop.scss";
.status-btn-box {
  width: 100%;
  @include flex(flex-start);
  flex-wrap: wrap;
  .ac-btn,
  .de-btn {
    width: 160px;
    height: 68px;
    @include round(4px);
    margin-right: 30px;
    font-size: 28px;
    font-family: $font;
    font-weight: 400;
    @include borderBox;
  }
  .ac-btn {
    background: $red;
    color: #fff;
  }
  .de-btn {
    background: #fff;
    border: 1px solid #dfdfdf;
    color: #666;
  }
  .contract-btn {
    margin-top: -32px;
    width: 200px;
    font-size: 30px;
  }
}
</style>
