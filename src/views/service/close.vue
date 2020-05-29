<template>
  <div class="ser-refund">
    <HeadNav title="关闭需求"></HeadNav>
    <div class="close-title">请选择您关闭的原因</div>
    <div class="refund">
      <van-radio-group v-model="radio">
        <van-cell-group :border="false">
          <van-cell :title="item.reason" clickable @click="radio = item.id" v-for="item in orderDetail.closeReason" :key="item.id">
            <van-radio slot="right-icon" checked-color="#F3262D" :name="item.id" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <input class="other-inp" type="text" maxlength="20" v-if="radio === 16" v-model="message" placeholder="请简单描述关闭原因（不超过20字）">
    </div>
    <div class="btn" @click="sureClose">确定</div>
  </div>
</template>

<script>
import { bodyColor } from '@/utils/mixins'
import { getOrderDetail, closeService } from '@/api/service'
export default {
  name: 'serviceRefund',
  mixins: [bodyColor('box100')],
  data () {
    return {
      message: '',
      radio: null,
      orderSn: this.$route.query.sn,
      orderDetail: {}
    }
  },
  created () {
    this.dataInit()
  },
  methods: {
    async dataInit () {
      const data = await getOrderDetail(this.orderSn)
      if (!data) return
      this.orderDetail = data
    },
    async sureClose () {
      if (this.radio === null) return this.$toast('请选择关闭原因')
      if (this.radio === 16 && this.message === '') return this.$toast('请填写其他原因')
      const data = await closeService({
        order_sn: this.orderSn,
        reason_id: this.radio,
        text: this.message
      })
      if (!data) return
      this.$toast('关闭需求成功！')
      this.$router.replace({ path: '/serviceOrder', query: { sn: this.orderSn } })
    }
  }
}
</script>

<style scoped lang="scss">
.ser-refund {
  height: 100%;
  @include flex;
  flex-direction: column;
}
.close-title {
  height: 77px;
  background: #f4f6f8;
  line-height: 77px;
  padding-left: rem(30);
  font-size: 26px;
  font-family: $font;
  font-weight: 400;
  width: 100%;
  color: #333;
  @include borderBox;
}
.refund {
  width: 100%;
  @include borderBox;
  flex: 1;
  background: #fff;
  /deep/ .van-cell {
    padding: rem(20) rem(30);
  }
  .other-inp {
    width: 690px;
    height: 70px;
    background: #fff;
    border: 1px solid #ccc;
    font-size: 22px;
    font-family: $font;
    font-weight: 400;
    color: #999;
    display: block;
    margin: auto;
    @include borderBox;
    padding: 20px;
  }
}
.btn {
  background: $red;
  width: 100%;
  height: 98px;
  @include flex(center);
  font-size: 30px;
  font-family: $font;
  font-weight: 500;
  color: #fff;
}
</style>
